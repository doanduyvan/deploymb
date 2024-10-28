<?php
namespace Models;
class QuizzesCMSModel{
    private $table = 'quizzesCMS';
    private $conn = null;
    private $fullPathAudio = '';
    function __construct()
    {
        $this->conn = BaseModel::getInstance();
    }

    public function addQuiz($dataRow){
        $idLesson = $dataRow['idLesson'];
        $quizName = $dataRow['quizName'];
        $media = $dataRow['media'];
        $questions = $dataRow['questions'];

        $quizName = $this->conn->real_escape_string($quizName);

        $sql = "INSERT INTO $this->table (title, idLessons) VALUES ('$quizName', $idLesson)";
        try {
            $this->conn->begin_transaction();
            $this->conn->query($sql);

            $newQuizId = $this->conn->insert_id;
            if($media !== null){
                $mediaModel = new MediaCMSModel();
                $saveMedia = $mediaModel->addMedia($newQuizId,$media);
                if(isset($saveMedia['error'])){
                    throw new \Exception($saveMedia['error']);
                }else{
                    $this->fullPathAudio = $saveMedia;
                }
            }
            $questionModel = new QuestionCMSModel();
            foreach ($questions as $question) {
                $saveQuestion = $questionModel->addQuestion($newQuizId, $question);
                if (isset($saveQuestion['error'])) {
                    throw new \Exception($saveQuestion['error']);
                }
            }
            $this->conn->commit();
            return ['message' => 'Add quiz success'];
        } catch (\Exception $e) {
            $this->conn->rollback();
            if(file_exists($this->fullPathAudio)){
                unlink($this->fullPathAudio);
            }
            return [
                'error' => $e->getMessage()
            ];
        }

    }

    public function getQuizByIdLesson($idUser,$idClass,$idLesson){
        $idLesson = $this->conn->real_escape_string($idLesson);
        $sql = "select cl.className, cl.id as idClass, le.lessonName, le.id as idLesson, qu.title as quizName , qu.id as idQuiz, re.score from quizzesCMS as qu
        inner join lessons as le on le.id = qu.idLessons
        inner join courses as co on co.id = le.idCourses
        inner join classes as cl on co.id = cl.idCourses
        inner join accounts_classes as ac on ac.idClasses = cl.id
        left join resultsCMS as re on re.idClasses = cl.id and re.idQuizzesCMS = qu.id
        where ac.idAccounts = $idUser and cl.id = $idClass and qu.idLessons = $idLesson";
        $stmt = $this->conn->query($sql);
        $result = $stmt->fetch_all(MYSQLI_ASSOC);
        return $result;
    }
    
    public function getQuestionByIdQuiz($idUser,$idClass, $idLesson, $idQuiz)
    {

        $idClass = $this->conn->real_escape_string($idClass);
        $idLesson = $this->conn->real_escape_string($idLesson);
        $idQuiz = $this->conn->real_escape_string($idQuiz);
        try{
                $sql = "select
                cla.id as idClass,
                cla.className,
                les.id as idLesson,
                les.lessonName,
                qui.id as idQuiz,
                qui.title as quizName	
                from quizzesCMS as qui
                inner join lessons as les on les.id = qui.idLessons
                inner join courses as cou on cou.id = les.idCourses
                inner join classes as cla on cla.idCourses = cou.id
                inner join accounts_classes as ac on ac.idClasses = cla.id
                where qui.id = $idQuiz and les.id = $idLesson and cla.id = $idClass and ac.idAccounts = $idUser";

            $stmt = $this->conn->query($sql);
            $quizzes = $stmt->fetch_assoc();
            if($quizzes === null){
                return [
                    'error' => 'Quiz not found'
                ];
            }
            $sql = "select m.title, m.type, m.content from mediaCMS as m where idQuizzesCMS = $idQuiz";
            $stmt = $this->conn->query($sql);
            $media = $stmt->fetch_assoc();
            $quizzes['mediaCMS'] = $media;
            $scoreLesson = $this->getPercentScoreLesson($idUser,$idClass,$idLesson);
            $quizzes['scoreUnit'] = $scoreLesson;
            $questionModel = new QuestionCMSModel();
            $questions = $questionModel->getQuestionByIdQuiz($idQuiz);
            $quizzes['questionsCMS'] = $questions;

            return $quizzes;

        }catch (\Exception $e) {
            return [
                'error' => $e->getMessage()
            ];
        }
    }

    function getPercentScoreLesson($idUser,$idClass,$idLesson){

        // lấy tổng số câu hỏi của bài học
        $sql = "select count(qui.id) as totalQuiz from quizzesCMS as qui where qui.idLessons = $idLesson";
        $stmt = $this->conn->query($sql);
        $totalQuiz = $stmt->fetch_assoc()['totalQuiz'];
        if($totalQuiz === 0){
            return 0;
        }
        // lấy toàn bộ điểm của bài học
        $sql = "select sum(res.score) as totalScore from resultsCMS as res 
        inner join quizzesCMS as qui on qui.id = res.idQuizzesCMS
        inner join lessons as les on les.id = qui.idLessons
        where res.idAccounts = $idUser and res.idClasses = $idClass and les.id = $idLesson";
        $stmt = $this->conn->query($sql);
        $totalScore = $stmt->fetch_assoc()['totalScore'];
        if($totalScore === null || $totalScore === 0){
            return 0;
        }
        $percent = round(($totalScore / ($totalQuiz * 10)) * 100,2);
        return $percent;
    }

    function getQuizName($dataRow){

        $idCourse = $dataRow['idCourse'];
        $idLesson = $dataRow['idLesson'];
        $currentPage = $dataRow['currentPage'];
        $itemsPerPage = $dataRow['itemsPerPage'];
        $offset = ($currentPage - 1) * $itemsPerPage;
        $conditions = [];
        if($idCourse !== null){
            $idCourse = $this->conn->real_escape_string($idCourse);
            $conditions[] = "cou.id = $idCourse";
        }
        if($idLesson !== null){
            $idLesson = $this->conn->real_escape_string($idLesson);
            $conditions[] = "les.id = $idLesson";
        }
        $sql = "select SQL_CALC_FOUND_ROWS cou.courseName, cou.id as idCourse, les.lessonName, qui.*, count(que.id) as totalQuestion from quizzesCMS as qui
        inner join lessons as les on les.id = qui.idLessons
        inner join courses as cou on cou.id = les.idCourses
        inner join questionsCMS as que on qui.id = que.idQuizzesCMS";
        if(count($conditions) > 0){
            $sql .= ' where ' . implode(' and ', $conditions);
        }
        $sql .= " group by qui.id order by qui.id desc limit $itemsPerPage offset $offset";

        $stmt = $this->conn->query($sql);
        $totalRow = $this->conn->query("SELECT FOUND_ROWS() as total")->fetch_assoc()['total'];
        $totalPages = ceil($totalRow / $itemsPerPage);
        $result = $stmt->fetch_all(MYSQLI_ASSOC);
        return [
            'quizzes' => $result,
            'totalPages' => $totalPages
        ];
    }

    function getQuizEdit($dataRow){
        $idCourse = $dataRow['idCourse'];
        $idLesson = $dataRow['idLesson'];
        $idQuiz = $dataRow['idQuiz'];

        $sql = "select cou.id as idCourse, les.id as idLesson, qui.id as idQuiz, qui.title as quizName, med.id as idMedia, med.title, med.type, med.content from quizzesCMS as qui
        inner join lessons as les on les.id = qui.idLessons
        inner join courses as cou on cou.id = les.idCourses
        left join mediaCMS as med on med.idQuizzesCMS = qui.id
        where cou.id = $idCourse and les.id = $idLesson and qui.id = $idQuiz";

        $stmt = $this->conn->query($sql);

        $result = $stmt->fetch_assoc();
        if($result === null){
            return [
                'error' => 'Quiz not found'
            ];
        }

        $mediaCMS = null;

        if($result['idMedia'] !== null){
            $mediaCMS = [
                'id' => $result['idMedia'],
                'title' => $result['title'],
                'type' => $result['type'],
                'content' => $result['content']
            ];
        }

        $result['mediaCMS'] = $mediaCMS;

        unset($result['idMedia']);
        unset($result['type']);
        unset($result['content']);
        unset($result['title']);

        $questionModel = new QuestionCMSModel();
        $questions = $questionModel->getQuestionByIdQuiz($idQuiz);
        $result['questionsCMS'] = $questions;
        
        return $result;
    }

    function updateQuiz($dataRow){
        $idCourse = $dataRow['idCourse'];
        $idLesson = $dataRow['idLesson'];
        $idQuiz = $dataRow['idQuiz'];
        $quizName = $this->conn->real_escape_string($dataRow['quizName']);
        $media = $dataRow['mediaCMS'];
        $questions = $dataRow['questionsCMS'];
        $arridQuestionDelete = $dataRow['arridQuestionDelete'];

        $mediaModel = new MediaCMSModel();
        $questionModel = new QuestionCMSModel();

        try{
            $this->conn->begin_transaction();
            $sql = "update quizzesCMS as qui set qui.idLessons = $idLesson, qui.title = '$quizName' where qui.id = $idQuiz";

            $check = $this->conn->query($sql);

            if(!$check){
                throw new \Exception("Failed to update quiz: " . $this->conn->error);
            }
            $mediaModel->updateMedia($idQuiz,$media);
            $questionModel->updateQuestion($idQuiz,$questions,$arridQuestionDelete);
            $this->conn->commit();

            $dataGetQuiz = [
                'idCourse' => $idCourse,
                'idLesson' => $idLesson,
                'idQuiz' => $idQuiz
            ];
            $dataRes = $this->getQuizEdit($dataGetQuiz);

            return ['message' => 'Update quiz success', 'data' => $dataRes];
            
        }catch (\Exception $e) {
            $this->conn->rollback();
            return [
                'error' => $e->getMessage()
            ];
        }

        return $dataRow;
    }

    function deleteQuiz($dataRow){

        $idQuiz = $dataRow['idQuiz'];
        try{
            $this->conn->begin_transaction();
            $mediaModel = new MediaCMSModel();
            $mediaModel->delMediaByIdQuiz($idQuiz);
            $sql = "delete from quizzesCMS where id = $idQuiz";
            $check = $this->conn->query($sql);
            if(!$check){
                throw new \Exception("Failed to delete quiz: " . $this->conn->error);
            }
            $this->conn->commit();
            return ['message' => 'Delete quiz success'];
        }catch (\Exception $e) {
            $this->conn->rollback();
            return [
                'error' => $e->getMessage()
            ];
        }
    }

}