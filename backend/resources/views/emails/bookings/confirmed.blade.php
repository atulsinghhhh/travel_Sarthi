<!DOCTYPE html>
<html>
<head>
    <title>Booking Confirmed</title>
</head>
<body>
    <h1>Hi {{ $booking->user->name ?? 'Traveller' }},</h1>
    <p>Your booking for <strong>{{ $packageTitle }}</strong> has been successfully confirmed!</p>
    <p>Booking ID: #{{ $booking->id }}</p>
    <p>Start Date: {{ $booking->start_date }}</p>
    <p>End Date: {{ $booking->end_date }}</p>
    <p>Total Amount: ${{ $booking->total_amount }}</p>
    <p>We wish you a wonderful trip!</p>
    <p>Thanks,<br>Travel Sarthi Team</p>
</body>
</html>
