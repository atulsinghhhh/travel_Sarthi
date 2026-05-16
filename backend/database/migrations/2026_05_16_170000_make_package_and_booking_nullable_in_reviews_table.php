<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->foreignId('hotel_id')->nullable()->constrained('hotels')->cascadeOnDelete();
            $table->unsignedBigInteger('package_id')->nullable()->change();
            $table->unsignedBigInteger('booking_id')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropForeign(['hotel_id']);
            $table->dropColumn('hotel_id');
            $table->unsignedBigInteger('package_id')->nullable(false)->change();
            $table->unsignedBigInteger('booking_id')->nullable(false)->change();
        });
    }
};
