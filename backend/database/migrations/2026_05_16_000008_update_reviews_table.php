<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::table('reviews', function (Blueprint $table) {
            $table->string('title')->nullable();
            $table->json('images')->nullable();
            $table->integer('helpful_count')->default(0);
            $table->unique(['user_id', 'package_id']);
        });
    }
    public function down() {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'package_id']);
            $table->dropColumn(['title', 'images', 'helpful_count']);
        });
    }
};
