import KloudstacLogo from "@/assets/KloudstacLogo.svg?react";
import LangflowLogo from "@/assets/LangflowLogo.svg?react";
import { useLoginUser } from "@/controllers/API/queries/auth";
import { ENABLE_NEW_LOGO } from "@/customization/feature-flags";
import * as Form from "@radix-ui/react-form";
import { useContext, useEffect, useState } from "react";
import secureLocalStorage from "react-secure-storage";
import InputComponent from "../../components/core/parameterRenderComponent/components/inputComponent";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { SIGNIN_ERROR_ALERT } from "../../constants/alerts_constants";
import { CONTROL_LOGIN_STATE } from "../../constants/constants";
import { AuthContext } from "../../contexts/authContext";
import useAlertStore from "../../stores/alertStore";
import { LoginType } from "../../types/api";
import {
  inputHandlerEventType,
  loginInputStateType,
} from "../../types/components";

export default function LoginPage(): JSX.Element {
  const [inputState, setInputState] =
    useState<loginInputStateType>(CONTROL_LOGIN_STATE);
  const { username, password } = inputState;
  const { login } = useContext(AuthContext);
  const setErrorData = useAlertStore((state) => state.setErrorData);

  // const sessionUser = sessionStorage.getItem('lflusr');
  // const sessionPassword = sessionStorage.getItem('lflpwd');

  // if (sessionUser && sessionPassword) {

  //   secureLocalStorage.setItem("lflusr", sessionUser);
  //   secureLocalStorage.setItem("lflpwd", sessionPassword);

  //   if (secureLocalStorage.getItem('lflusr') && secureLocalStorage.getItem('lflpwd')) {
  //     sessionStorage.removeItem("lflusr");
  //     sessionStorage.removeItem("lflpwd");
  //   }
  // }

  function handleInput({
    target: { name, value },
  }: inputHandlerEventType): void {
    setInputState((prev) => ({ ...prev, [name]: value }));
  }

  const { mutate } = useLoginUser();

  function signIn(user?: string, pass?: string) {
    const userData: LoginType = {
      username: (user || username).trim(),
      password: (pass || password).trim(),
    };

    mutate(userData, {
      onSuccess: (data) => {
        login(data.access_token, "login", data.refresh_token);
        secureLocalStorage.setItem("lngflw_accessToken", data.access_token);
      },
      onError: (error) => {
        setErrorData({
          title: SIGNIN_ERROR_ALERT,
          list: [error.response.data.detail],
        });
      },
    });
  }

  useEffect(() => {
    // if()
    if (inputState.username && inputState.password) {
      signIn(inputState.username, inputState.password);
    }
    secureLocalStorage.removeItem('lngflw_accessToken');
  }, []);

  useEffect(() => {
    const sessionUser = sessionStorage.getItem("lflusr");
    const sessionPassword = sessionStorage.getItem("lflpwd");
  
    if (sessionUser && sessionPassword) {
      secureLocalStorage.setItem("lflusr", sessionUser);
      secureLocalStorage.setItem("lflpwd", sessionPassword);
      sessionStorage.removeItem("lflusr");
      sessionStorage.removeItem("lflpwd");
  
      setInputState({
        username: sessionUser,
        password: sessionPassword,
      });
  
      // ✅ Auto-trigger sign-in when credentials are found
      signIn(sessionUser, sessionPassword);
    }
  }, []);
  

  return (
    <Form.Root
      onSubmit={(event) => {
        if (password === "") {
          event.preventDefault();
          return;
        }
        signIn();
        event.preventDefault();
      }}
      className="h-screen w-full"
    >
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="flex w-72 flex-col items-center justify-center gap-2">
          {ENABLE_NEW_LOGO ? (
            <KloudstacLogo
              title="Kloudstac logo"
              className="mb-4 h-10 w-10 scale-[2.5]"
            />
          ) : (
            <span className="mb-4 text-5xl">⛓️</span>
          )}
          <span className="mb-6 text-2xl font-semibold text-primary">
            Sign in to AI Playground
          </span>
          <div className="mb-3 w-full">
            <Form.Field name="username">
              <Form.Label className="data-[invalid]:label-invalid">
                Email <span className="font-medium text-destructive">*</span>
              </Form.Label>
              <Form.Control asChild>
                <Input
                  type="text"
                  onChange={({ target: { value } }) =>
                    handleInput({ target: { name: "username", value } })
                  }
                  value={username}
                  className="w-full"
                  required
                  placeholder="Username"
                />
              </Form.Control>
              <Form.Message match="valueMissing" className="field-invalid">
                Please enter your username
              </Form.Message>
            </Form.Field>
          </div>
          <div className="mb-3 w-full">
            <Form.Field name="password">
              <Form.Label className="data-[invalid]:label-invalid">
                Password <span className="font-medium text-destructive">*</span>
              </Form.Label>
              <InputComponent
                onChange={(value) =>
                  handleInput({ target: { name: "password", value } })
                }
                value={password}
                isForm
                password={true}
                required
                placeholder="Password"
                className="w-full"
              />
              <Form.Message className="field-invalid" match="valueMissing">
                Please enter your password
              </Form.Message>
            </Form.Field>
          </div>
          <div className="w-full">
            <Form.Submit asChild>
              <Button
                className="mr-3 mt-6 w-full"
                type="submit"
                style={{ backgroundColor: "#5ABA47" }}
              >
                Sign in
              </Button>
            </Form.Submit>
          </div>
        </div>
      </div>
    </Form.Root>
  );
}
