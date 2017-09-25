<?php


namespace Site;


use Petun\Forms\Actions\MailAction;

class MailActionHq extends MailAction
{

    /**
     * @return bool
     * @throws \Exception
     * @throws \phpmailerException
     */
    function run() {
        //Create a new PHPMailer instance
        $mail = new \PHPMailer;

        $mail->CharSet = 'utf-8';

        // Set PHPMailer to use the sendmail transport
        //$mail->isSendmail();

        if ($this->useSmtp) {
            $mail->isSMTP();
            $mail->SMTPAuth = $this->smtpAuth;
            $mail->Host = $this->smtpHost;
            $mail->Port = $this->smtpPort;
            $mail->Password = $this->smtpPassword;
            $mail->Username = $this->smtpUsername;
            $mail->SMTPOptions = [
                'ssl' => array(
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                )
            ];
        }

        // from
        $mail->setFrom($this->from, $this->fromName);

        $mail->addReplyTo($this->_getReply());
        $mail->addAddress($this->to);

        //Set the subject line
        $mail->Subject = 'Fwd: ' . $this->_form->fieldValue('type');

        $mail->isHTML(false);
//        $mail->addCC('sergey@sharecloth.com');
//        $mail->addCC('petun911@gmail.com');

        $data = $this->_form->fieldValues();

        $mail->Body =
"/tag Inbound
---------- Forwarded message ----------
From: ".$data['Your name']." <".$data['Email'].">
Date: ". gmdate("D, d M Y H:i:s", time()) . "
Subject: ".$data['Request type']."
To: team@sharecloth.com

".strip_tags($this->_getBody())."
        ";

        if (!$mail->send()) {
            return false;
        } else {
            return true;
        }
    }


    /**
     * @return string
     */
    private function _getBody() {
        $this->_smarty->assign('subject', $this->subject);
        $this->_smarty->assign('to', $this->_getTo());
        $this->_smarty->assign('values', $this->_form->fieldValues());
        $this->_smarty->assign('actionResults', $this->_form->getActionResults());
        return $this->_smarty->fetch($this->template);
    }




}