<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->company(),
            'slug' => fake()->unique()->slug(),
            'description' => fake()->paragraph(),
            'short_description' => fake()->sentence(),
            'location' => 'New Cairo',
            'status' => 'Now selling',
            'project_type' => 'Residential',
            'currency' => 'EGP',
            'area_unit' => 'm2',
            'is_featured' => false,
            'is_published' => false,
            'sort_order' => 0,
        ];
    }
}
