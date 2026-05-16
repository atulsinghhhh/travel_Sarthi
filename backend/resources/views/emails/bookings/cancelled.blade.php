<!DOCTYPE html>
<html>
<head>
    <title>Booking Cancelled</title>
</head>
<body>
    <h1>Hi {{ $booking->user->name ?? 'Traveller' }},</h1>
    <p>Your booking for <strong>{{ $packageTitle }}</strong> (Booking ID: #{{ $booking->id }}) has been cancelled.</p>
    <p>If you have already paid, a refund will be processed according to our policy within 5-7 business days.</p>
    <p>We hope to serve you again in the future!</p>
    <p>Thanks,<br>Travel Sarthi Team</p>
</body>
</html>
