/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
        './resources/js/**/*.ts',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                display: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                serif: ['Cormorant Garamond', 'ui-serif', 'Georgia', 'serif'],
            },
        },
    },
};
