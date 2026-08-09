<?php

namespace Database\Factories;

use App\Models\MediaPost;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MediaPost>
 */
class MediaPostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => 'blog',
            'title' => fake()->sentence(5),
            'slug' => fake()->unique()->slug(),
            'excerpt' => fake()->paragraph(),
            'content' => fake()->paragraphs(3, true),
            'is_featured' => false,
            'is_published' => false,
        ];
    }
}
