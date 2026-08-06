<?php

namespace Database\Factories;

use App\Models\Job;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Job>
 */
class JobFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->jobTitle(),
            'slug' => fake()->unique()->slug(),
            'department' => 'Design',
            'location' => 'New Cairo',
            'employment_type' => 'Full-time',
            'experience_level' => 'Mid-level',
            'summary' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'requirements' => fake()->paragraph(),
            'responsibilities' => fake()->paragraph(),
            'benefits' => fake()->paragraph(),
            'is_published' => false,
            'is_featured' => false,
        ];
    }
}
