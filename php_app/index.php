<?php
// error_reporting(E_ALL);
$ERROR_LOG_FILE = "/tmp/app.log";
error_log('ERROR_LOG', 0, $ERROR_LOG_FILE);
// trigger_error("TG USER NOTICE", E_USER_NOTICE);
// trigger_error("TG USER WARNING", E_USER_WARNING);
// trigger_error("TG USER ERROR", E_USER_ERROR);
// new Exception('EXCEPTION')
class LogMessage {
    public $message;
    public function construct($type,$msg){
        
    }
}
class Logger
{
    static $WARNING = 'WARNING';
    static $NOTICE = "NOTICE";
    static $EXCEPTION = "EXCEPTION";
    static $INFO = "INFO";

    public static function log($type, $msg)
    {
        error_log(self::createMsg($type, $msg), 0);
    }
    public static function warning($msg){
        self::log(self::$WARNING, $msg);
    }
    public static function notice($msg){
        self::log(self::$NOTICE, $msg);
    }
    public static function info($msg){
        self::log(self::$INFO, $msg);
    }
    public static function exception($msg){
        self::log(self::$EXCEPTION, $msg);
    }
    public static function createMsg($type,$msg){
        $d = debug_backtrace()[0];
        $msg->type = $type;
        $msg->serviceName= getenv("APP_NAME");
        $msg->serviceVersion=getenv("APP_VERSION");
        $msg->serviceFunction =$d['function'];
        $msg->line =$d['line'];
        $msg->file = $d['file'];
        $msg->seviceType ="app";
        $msg->memory = memory_get_usage();
        return json_encode($msg);
    }
}

$msg = (object)["companyId" => 1,
                "orderId" => 12345,
                "clientId" => 98765,
                "productId" => 'abc123',
                "msg" => 'No Stock'];
\Logger::warning($msg);
\Logger::notice($msg);
\Logger::info($msg);
\Logger::exception($msg);

?>
    Test Grafana Logs 
