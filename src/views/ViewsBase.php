<?php

namespace Views;

class ViewsBase
{
    protected $title = "Document";
    protected $arrCSS = [];
    protected $arrJS = [];

    protected function renderCSS(){
        foreach($this->arrCSS as $css){
            ?>
            <link rel="stylesheet" href="<?= $css ?>">
            <?php
        }
    }

    protected function renderModuleJS(){

    }

    protected function renderJS(){
        foreach($this->arrJS as $js){
            ?>
            <script type="module" src="<?= $js ?>"></script>
            <?php
        }
    }

    function renderBody(){
        
    }

    function render()
    {
?>
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <base href="<?= WEB_ROOT ?>">
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
            <title><?= $this->title ?></title>
            <meta name="description" content="Join fun and engaging English quizzes on elearning.anhngumb.com, where you can enhance your language skills with diverse and interesting questions. Suitable for learners at all levels, from beginner to advanced.">
            <meta property="og:type" content="website">
            <meta property="og:url" content="https://elearning.anhngumb.com/">
            <meta property="og:title" content="English Quiz - Improve Your Language Skills | elearning.anhngumb.com">
            <meta property="og:image" content="public/img/meta_anhngumb.jpg">
            <link rel="icon" href="public/img/cropped-LogoMrBien_512-300x300.png">
            <?= $this->renderCSS() ?>
            <?= $this->renderModuleJS() ?>
        </head>
        <body>
            <?= $this->renderBody() ?>
            <?= $this->renderJS() ?>
        </body>
        </html>
<?php
    }
}

?>