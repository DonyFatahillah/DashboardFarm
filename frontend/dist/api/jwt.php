<?php
class JWT {
    public static function encode($payload, $secret) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode(json_encode($payload)));
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }
    public static function decode($token, $secret) {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return false;
        $signature = hash_hmac('sha256', $parts[0] . "." . $parts[1], $secret, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        if (hash_equals($base64UrlSignature, $parts[2])) {
            return json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), true);
        }
        return false;
    }
}
