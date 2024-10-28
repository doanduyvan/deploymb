<?php
namespace Models;
class ClassModel{

    private $conn = null;
    private $table = 'classes';

    private $classDetailModel = null;

    public function __construct()
    {
        $this->conn = BaseModel::getInstance();
        $this->classDetailModel = new ClassDetailModel();
    }

    public function getClasses($dataRow)
    {
        $currentPage = $dataRow['currentPage'];
        $itemsPerPage = $dataRow['itemPerPage'];
        $idCourses = $dataRow['idCourses'];
        $status = $dataRow['status'];

        $conditions = [];

        if($idCourses !== null){
            $conditions[] = "cl.idCourses = $idCourses";
        }

        if($status !== null){
            $conditions[] = "cl.statuss = $status";
        }

        $offset = ($currentPage - 1) * $itemsPerPage;
        $sql = "select SQL_CALC_FOUND_ROWS cl.*, co.courseName, COUNT(CASE WHEN ac.statuss = 1 THEN 1 END) AS inclass, COUNT(CASE WHEN ac.statuss = 0 THEN 1 END) AS pending from classes as cl
        inner join courses as co on co.id = cl.idCourses 
        left join accounts_classes as ac on ac.idClasses = cl.id";

        if(count($conditions) > 0){
            $sql .= " WHERE " . implode(' AND ', $conditions);
        }

        $sql .= " group by cl.id ORDER BY cl.id DESC LIMIT $itemsPerPage OFFSET $offset";

        $stmt = $this->conn->query($sql);
        $totalRow = $this->conn->query("SELECT FOUND_ROWS() as total")->fetch_assoc()['total'];
        $totalPages = ceil($totalRow / $itemsPerPage);
        $classes = $stmt->fetch_all(MYSQLI_ASSOC);

        return [
            'Classes' => $classes,
            'totalPages' => $totalPages
        ];
    }

    public function getClassesById($classId){
        $sql = "SELECT * FROM $this->table WHERE id = $classId";
        $stmt = $this->conn->query($sql);
        $course = $stmt->fetch_assoc();
        return $course;
    }

    public function getTotalClasses(){
        $totalItemsQuery = $this->conn->query("SELECT COUNT(*) as total FROM $this->table");
        $totalItems = $totalItemsQuery->fetch_assoc();
        return $totalItems['total'];
    }

    public function addClass($dataRow){
        $className = $dataRow['className'];
        $idCourses = $dataRow['courseId'];
        $sql = "INSERT INTO $this->table (className, statuss, idCourses) VALUES ('$className', 1,'$idCourses')";
        try {
            $this->conn->begin_transaction();
            $this->conn->query($sql);
            $newClassId = $this->conn->insert_id;
            $newClass = $this->getClassesById($newClassId);
            $this->conn->commit();
            return $newClass;
        } catch (\Exception $e) {
            $this->conn->rollback();
            return [
                'error' => $e->getMessage()
            ];
        }
    }

    public function editClass($dataRow){
        $classId = $dataRow['classId'];
        $className = $dataRow['className'];
        $courseId = $dataRow['courseId'];
        $sql = "UPDATE $this->table SET className = '$className', idCourses = '$courseId' WHERE id = $classId";
        try {
            $this->conn->begin_transaction();
            $this->conn->query($sql);
            $newClass = $this->getClassesById($classId);
            $this->conn->commit();
            return $newClass;
        } catch (\Exception $e) {
            $this->conn->rollback();
            return [
                'error' => $e->getMessage()
            ];
        }
    }

    public function deleteClass($dataRow){
        $classId = $dataRow['id'];
        $sql = "DELETE FROM $this->table WHERE id = $classId";
        try {
            $this->conn->begin_transaction();
            $this->conn->query($sql);
            $this->conn->commit();
            return true;
        } catch (\Exception $e) {
            $this->conn->rollback();
            return [
                'error' => $e->getMessage()
            ];
        }
    }




    // code by duyvan

    public function getClassActive(){
        $sql = "SELECT * FROM $this->table WHERE statuss = 1 ORDER BY id DESC";
        $stmt = $this->conn->query($sql);
        $classes = $stmt->fetch_all(MYSQLI_ASSOC);
        return $classes;
    }


    public function updateStatus($dataRow){
        
        $classId = $dataRow['id'];
        $statuss = $dataRow['statuss'];
        $sql = "UPDATE $this->table SET statuss = '$statuss' WHERE id = $classId";
        try {
            $this->conn->begin_transaction();
            $this->conn->query($sql);
            $newClass = $this->getClassesById($classId);
            $this->conn->commit();
            return $newClass;
        } catch (\Exception $e) {
            $this->conn->rollback();
            return [
                'error' => $e->getMessage()
            ];
        }
    }

    public function getClassesByUser($idUser){
        $sql = "select c.className, c.id as idClass from classes c 
        inner join accounts_classes ac on c.id = ac.idClasses
        where ac.idAccounts = $idUser and ac.statuss = 1
        order by c.id desc";
        $stmt = $this->conn->query($sql);
        $classes = $stmt->fetch_all(MYSQLI_ASSOC);
        return $classes;
    }


    public function getClassJoinedAndPending($idUser,$status){
        $sql = "select co.courseName, cl.className, cl.id as idClass from classes as cl
        inner join courses as co on co.id = cl.idCourses
        left join accounts_classes as ac on cl.id = ac.idClasses
        where ac.idAccounts = $idUser and ac.statuss = $status order by cl.id desc";
        $stmt = $this->conn->query($sql);
        $result = $stmt->fetch_all(MYSQLI_ASSOC);

        foreach ($result as $key => $value) {
            $result[$key]['quantityStudent'] = $this->classDetailModel->countMemberByClass($value['idClass']);
        }
        return $result;
    }

}