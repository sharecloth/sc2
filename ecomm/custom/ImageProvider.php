<?php

use Alchemy\Zippy\Zippy;

require_once "../../vendor/autoload.php";

/**
 * @author Petr Marochkin petun911@gmail.com
 */
class ImageProvider
{
    /** @var string */
    protected $baseImgPath;

    const TYPE_COLOR = 'color';

    const TYPE_FABRIC = 'fabric';

    const TYPE_PRINT = 'print';

    /**
     * Main thing - that we can change
     *
     * @var array
     */
    protected $names = [
        self::TYPE_PRINT => '1391(2).png',
        self::TYPE_FABRIC => 'round_normal.jpg',
        self::TYPE_COLOR => 'Bershka_L_52_T_shit_Whait.jpg',
    ];

    protected $types = [
        self::TYPE_COLOR,
        self::TYPE_FABRIC,
        self::TYPE_PRINT
    ];

    /**
     * ImageProvider constructor.
     */
    public function __construct()
    {
        $this->baseImgPath = __DIR__ . DIRECTORY_SEPARATOR . 'img' . DIRECTORY_SEPARATOR;
        $this->tmpPath = $this->baseImgPath . 'tmp' . DIRECTORY_SEPARATOR;
    }

    /**
     * @param $type
     * @return array
     */
    public function scanTypeDir($type)
    {
        $directory = $this->getTypePath($type);
        return $this->scanDir($directory);
    }

    private function scanDir($dir) {
        return array_diff(scandir($dir), array('..', '.'));
    }

    /**
     * @param $data
     * @return string
     */
    public function processForm($data)
    {

        $this->clearTmpDir();
        foreach ($this->types as $type) {
            if ($src = $this->ensureFileExists($type, $data[$type])) {
                $this->copyFileToTmp($src, $type);
            }
        }

        $this->zipTmpDir();
    }


    /**
     * @param $type
     * @param $name
     * @return string
     * @throws Exception
     */
    private function ensureFileExists($type, $name)
    {
        $fullName = $this->getTypePath($type) . $name;

        if (file_exists($fullName)) {
            return $fullName;
        }

        throw new \Exception('File ' . $fullName . ' not found');
    }

    /**
     * @param $sourceFileName
     * @param $type
     * @throws Exception
     */
    private function copyFileToTmp($sourceFileName, $type)
    {
        if (!@copy(
            $sourceFileName,
            $this->getTmpFilePath($type)
        )
        ) {
            throw new \Exception('Can not copy file to output directory');
        }
    }

    /**
     * @param $type
     * @return string
     */
    private function getTypePath($type)
    {
        return $this->baseImgPath . $type . DIRECTORY_SEPARATOR;
    }

    /**
     * @param $type
     * @return string
     */
    private function getTmpFilePath($type)
    {
        return $this->tmpPath . $this->names[$type];
    }

    /**
     *
     */
    private function clearTmpDir()
    {
        foreach ($this->types as $type) {
            @unlink($this->getTmpFilePath($type));
        }

        @unlink($this->tmpPath . 'textures.zip');
    }

    /**
     * 
     */
    private function zipTmpDir()
    {
        $zippy = Zippy::load();

        $zipPath = $this->tmpPath . 'textures.zip';

        $files = $this->scanDir($this->tmpPath);

        $result = [];
        foreach ($files as $file) {
            $result[basename($file)] = $this->tmpPath . $file;
        }

        $zippy->create($zipPath, $result);

        header("Content-Type: application/zip");
        header("Content-Length: ". filesize($zipPath));
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        readfile($zipPath);
        exit;
    }


}