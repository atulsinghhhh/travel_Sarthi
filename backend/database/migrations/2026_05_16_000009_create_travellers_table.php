<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('travellers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('full_name');
            $table->date('dob');
            $table->string('gender');
            $table->string('passport_number');
            $table->date('passport_expiry');
            $table->string('nationality');
            $table->string('phone');
            $table->timestamps();
        });
    }
    public function down() {
        Schema::dropIfExists('travellers');
    }
};
