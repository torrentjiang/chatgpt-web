import { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { useAccessStore } from "../store";
import { useEffect, useState } from "react";
import { login } from "../client/api";
import toast, { Toaster } from "react-hot-toast";
// import qs from 'qs';
import styles from "./auth.module.scss";
interface GetAggregateTicketReq {
  username: string;
  password: string;
  type: number; // 1=MIS登录，2=SSO登录 0=cookie登录
  otp?: string; // 用户代理
}

export function AuthPage() {
  const navigate = useNavigate();
  const access = useAccessStore();

  const goHome = () => navigate(Path.Home);

  // useEffect(() => {
  //   // if (getClientConfig()?.isApp) {
  //   //   navigate(Path.Settings);
  //   // }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   const referSw = () => {
  //     const env = 'dev';
  //     switch(env) {
  //       case 'dev':
  //       default:
  //         return 'http%3A%2F%2F172.31.9.102:3000%2F%23%2Fchat';
  //     }
  //   }; // refer
  //   const refer: string = referSw()
  //   setTimeout(() => {
  //     window.location.replace(`http://127.0.0.1:3001/AI-oncall-login?refer=${refer}`)
  //   }, 500);
  // }, []);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [otp, setOtp] = useState<string>("");

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleOtp = (event: ChangeEvent<HTMLInputElement>) => {
    setOtp(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (!otp || !password || !username) {
      return;
    }
    let query: GetAggregateTicketReq = {
      username: username,
      password: password,
      otp: otp,
      type: 2,
    };
    login(query).then((res: any) => {
      if (res.data.errCode === 0) {
        const { token = "", data } = res.data || {};
        const { ticket = undefined } = data || {};

        if (ticket) {
          // let { refer }: any = qs.parse(window.location.href.split('?')[1]);
          // const redirectHref = `${decodeURIComponent(refer)}${
          //   refer.includes('?') ? '&' : '?'
          // }ticket=${ticket}`;
          // window.location.replace(redirectHref);
          localStorage.setItem("AI_accessToken", token);
          window.location.replace(
            `${window.location.origin}/AI-helper/#/chat`,
          );
        } else {
          toast.error(res.data.errMsg || "获取ticket异常", {
            duration: 3000,
            position: "top-center",
          });
          console.log(res.data.errMsg || "获取ticket异常");
        }
      } else {
        toast.error(res.data.errMsg || "当前用户登录失败", {
          duration: 3000,
          position: "top-center",
        });
        console.log(res.data.errMsg || "当前用户登录失败");
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.heading}>域账号</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>用户</label>
            <input
              type="text"
              className={styles.input}
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>密码</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>OTP</label>
            <input
              type="text"
              className={styles.input}
              value={otp}
              onChange={handleOtp}
            />
          </div>
          <button type="submit" className={styles.button}>
            登录
          </button>
        </form>
      </div>
      <Toaster />
    </div>
  );
}
