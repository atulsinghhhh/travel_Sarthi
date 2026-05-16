<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->json('itinerary')->nullable();
            $table->json('included')->nullable();
            $table->json('excluded')->nullable();
            $table->json('images')->nullable();
            $table->json('available_dates')->nullable();
            $table->foreignId('hotel_id')->nullable()->constrained()->nullOnDelete();
        });
    }

    public function down()
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropForeign(['hotel_id']);
            $table->dropColumn(['itinerary', 'included', 'excluded', 'images', 'available_dates', 'hotel_id']);
        });
    }
};
