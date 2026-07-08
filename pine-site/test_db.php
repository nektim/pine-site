<?php
$host = 'localhost';
$port = '3307';
$dbname = 'sosnovy_rai';
$user = 'pine_admin';
$pass = 'PineAdmin2024!';
$dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    $pdo->exec("SET NAMES utf8mb4");
    echo "Подключение успешно!";
} catch (PDOException $e) {
    echo "Ошибка: " . $e->getMessage();
}