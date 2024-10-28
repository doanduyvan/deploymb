<?php

namespace Models;

class ProfileModel
{

    private $conn = null;
    private $table = 'accounts';

    public function __construct()
    {
        $this->conn = BaseModel::getInstance();
    }

    public function getAccount()
    {
        if (isset($_SESSION['id'])) {
            $user_id = $_SESSION['id'];
            $sql = "SELECT * FROM $this->table WHERE id = '$user_id' AND statuss = 1";
            try {
                $this->conn->begin_transaction();
                $this->conn->query($sql);
                $this->conn->commit();
                $result = $this->conn->query($sql);
                if ($result) {
                    $row = $result->fetch_assoc();
                    if ($row) {
                        return $row;
                    } else {
                        return "Không tìm thấy tài khoản.";
                    }
                }
            } catch (\Exception $e) {
                $this->conn->rollback();
                return [
                    'error' => $e->getMessage()
                ];
            }
        } else {
            echo "No user token found.";
        }
    }


    public function updateAccount($dataRow)
    {
        $user_id = $dataRow['id'];
        $fullName = $dataRow['name'];
        $sql = "UPDATE $this->table SET fullName = '$fullName' WHERE id = $user_id";
        try {
            $this->conn->begin_transaction();
            $this->conn->query($sql);
            $newClass = $this->getAccountById($user_id);
            $this->conn->commit();
            return $newClass;
        } catch (\Exception $e) {
            $this->conn->rollback();
            return [
                'error' => $e->getMessage()
            ];
        }
    }

    public function getAccountById($accountId)
    {
        $sql = "SELECT * FROM $this->table WHERE id = $accountId";
        $stmt = $this->conn->query($sql);
        $account = $stmt->fetch_assoc();
        return $account;
    }
    public function changepassword($datareq)
    {
        $id = $datareq['accountId'];
        $currenPassword = $datareq['currentPassword'];
        $newPassword = $datareq['newPassword'];
        $sql = "UPDATE $this->table SET pass = '$newPassword' where id = '$id' and pass = '$currenPassword'";
        $stmt = $this->conn->query($sql);
        return $stmt;
    }
}
