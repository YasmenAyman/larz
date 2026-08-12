<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

class OptimizeWebsiteAssets extends Command
{
    protected $signature = 'assets:optimize-images {--quality=82 : WebP quality (0-100)}';

    protected $description = 'Create resized WebP versions of public website images';

    public function handle(): int
    {
        if (! function_exists('imagecreatefromstring') || ! function_exists('imagewebp')) {
            $this->error('The GD extension with WebP support is required.');

            return self::FAILURE;
        }

        // Large architectural renders can briefly require substantial memory
        // while GD decodes and resizes them. This command only runs during
        // asset preparation, never during a web request.
        ini_set('memory_limit', '1024M');

        $quality = min(100, max(0, (int) $this->option('quality')));
        $maxDimension = 2560;
        $saved = 0;

        foreach ([public_path('assets'), resource_path('assets')] as $assets) {
            if (! is_dir($assets)) {
                continue;
            }

            foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($assets)) as $file) {
            if (! $file->isFile() || ! preg_match('/\.(png|jpe?g)$/i', $file->getFilename())) {
                continue;
            }

            $contents = file_get_contents($file->getPathname());
            $source = $contents === false ? false : @imagecreatefromstring($contents);
            if (! $source) {
                $this->warn("Skipped invalid image: {$file->getFilename()}");
                continue;
            }

            $width = imagesx($source);
            $height = imagesy($source);
            $scale = min(1, $maxDimension / max($width, $height));
            $targetWidth = max(1, (int) round($width * $scale));
            $targetHeight = max(1, (int) round($height * $scale));
            $target = imagecreatetruecolor($targetWidth, $targetHeight);
            imagealphablending($target, false);
            imagesavealpha($target, true);
            imagefill($target, 0, 0, imagecolorallocatealpha($target, 0, 0, 0, 127));
            imagecopyresampled($target, $source, 0, 0, 0, 0, $targetWidth, $targetHeight, $width, $height);

            $destination = preg_replace('/\.(png|jpe?g)$/i', '.webp', $file->getPathname());
            if (! imagewebp($target, $destination, $quality)) {
                $this->error("Unable to write {$destination}");
                imagedestroy($source);
                imagedestroy($target);
                return self::FAILURE;
            }

            imagedestroy($source);
            imagedestroy($target);
            $saved++;
            }
        }

        $this->info("Created {$saved} optimized WebP images.");

        return self::SUCCESS;
    }
}
