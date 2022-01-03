import React, { useContext, useEffect } from "react";
import { Avatar, Button, Space } from "antd";
import {
  app,
  facebookAuthProvider,
  googleAuthProvider,
} from "../../../config/firebaseConfig";
import { openInfoLoading, openNotification } from "./Alert";
import google from "../../../static/images/Google.svg";
import fb from "../../../static/images/Facebook.svg";
import { useHistory } from "react-router-dom";
import { Auth } from "../../../contexts/AuthContext";

const SocialButtons = () => {
  const history = useHistory();
  const { user, getUser } = useContext(Auth);

  useEffect(() => {
    history.push("/boards");
    // eslint-disable-next-line
  }, [user]);

  const socialLogin = async (provider) => {
    openInfoLoading(true);
    await app
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        openInfoLoading(false);
        openNotification("success", "Correcto", "Inicio de sesión exitoso");
        console.log(result.user);
        getUser();
      })
      .catch((error) => {
        openInfoLoading(false);
        console.log(error);
        let message = "Error inesperado. Intenta nuevamente";
        if (error.code === "auth/network-request-failed") {
          message = "Comprueba tu conexión a internet y vuelve a intentarlo";
        }
        if (error.code === "auth/account-exists-with-different-credential") {
          message =
            "Una cuenta con el mismo correo ya existe. Probablemente ingresaste con otro método u otra red social";
        }
        openNotification("error", "Error", message);
      });
  };

  return (
    <div>
      <Space size="middle" className="my-3">
        <Button type="link" onClick={() => socialLogin(googleAuthProvider)}>
          <Avatar size="large" src={google} />
        </Button>
        <Button type="link" onClick={() => socialLogin(facebookAuthProvider)}>
          <Avatar size="large" src={fb} />
        </Button>
      </Space>
    </div>
  );
};
export default SocialButtons;
