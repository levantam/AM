import { Button, Modal, QRCode, Space } from "antd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQrcode, faShare } from '@fortawesome/free-solid-svg-icons'
import React from "react";
import { ToolInformationDto } from "../models";
import {
    EmailShareButton,
    FacebookShareButton,
    TelegramShareButton,
    TwitterShareButton,
    FacebookIcon,
    EmailIcon,
    TelegramIcon,
    TwitterIcon
  } from "react-share";

export interface IShareButtonProps {
    tool?: ToolInformationDto
}

export const ShareButton = () => {
    const [isShowModalBox, setIsShowModalBox] = React.useState<boolean>(false);
    const [qrCodeValue, setQRCodeValue] = React.useState<string>('');
    const [urlToShare, setUrlToShare] = React.useState<string>('');

    React.useEffect(() => {
        setQRCodeValue(window.location.href);
        setUrlToShare(window.location.href);
    }, []);

    return (
        <>
            <Button onClick={() => { setIsShowModalBox(true) }} type="dashed" icon={<FontAwesomeIcon icon={faShare} />}>
                Chia sẻ
            </Button>

            <Modal okButtonProps={{hidden: true}} cancelButtonProps={{hidden: true}} title="Chia Sẻ" open={isShowModalBox} onOk={() => {setIsShowModalBox(false)}} onCancel={() => {setIsShowModalBox(false)}}>
                <Space>
                    <QRCode value={qrCodeValue} />
                    <EmailShareButton children={<EmailIcon />} url={urlToShare} />
                    <FacebookShareButton children={<FacebookIcon />} url={urlToShare} />   
                    <TelegramShareButton children={<TelegramIcon />} url={urlToShare} />
                    <TwitterShareButton children={<TwitterIcon />} url={urlToShare} />
                </Space>
                
            </Modal>
        </>
    )
}