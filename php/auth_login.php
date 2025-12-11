<?php
header('Content-Type: application/json');
require 'db_connect.php';

// Get JSON input
$input = file_get_contents("php://input");
$data = json_decode($input);

if (!isset($data->email) || !isset($data->password)) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
    exit;
}

$email = $conn->real_escape_string($data->email);
$password = $data->password;

// Using prepared statement for security
// User specified columns: ID, MAIL, PASSWORD
$stmt = $conn->prepare("SELECT ID, PASSWORD FROM usuarios WHERE MAIL = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    // Direct comparison (assuming plain text for this exercise based on "valide los datos")
    // In production, use password_verify($password, $row['password'])
    // Note: PHP array keys are case-sensitive. Fetching assoc might return uppercase keys if query used uppercase.
    // However, usually drivers return keys matching the query casing.
    if ($password === $row['PASSWORD']) {
        echo json_encode(['success' => true, 'message' => 'Login exitoso']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Usuario o contraseña incorrectos']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Usuario o contraseña incorrectos']);
}

$stmt->close();
$conn->close();
?>