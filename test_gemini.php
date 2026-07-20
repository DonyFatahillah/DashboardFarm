<?php
$key = 'AIzaSyBsw-nQEhWtL98fFRVgLFHk8nLIuHb0WsM';
$model = $argv[1] ?? 'gemini-1.5-flash';
$url = "https://generativelanguage.googleapis.com/v1beta/models/$model:generateContent?key=$key";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['contents' => [['role' => 'user', 'parts' => [['text' => 'Hello']]]]]));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Model: $model\n";
echo "HTTP Code: $httpCode\n";
echo "Response: $response\n";
