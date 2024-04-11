"use client";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BaseSyntheticEvent, useState } from "react";
import { object, string } from "yup";
import * as yup from "yup";
import { useAtom } from "jotai";
import { userAtom } from "../../jotai/UserAtom";
import { useNavigate } from "react-router-dom";
import { Message } from "./Message";
type Props = {};

export const DynamicForm = (props: Props) => {
  const nav = useNavigate()
  const [user,setUser] = useAtom(userAtom);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [type, setType] = useState<"sign-in" | "sign-up">("sign-in");
  const [validationError, setValidationError] =
    useState<yup.ValidationError | null>(null);


  const authSchema = () => {
    let passwordValidation = string().min(4).required();
    let authObject = {
      email: string().email().required(),
    };


    return object(
      type === "sign-up"
        ? {
            ...authObject,
            username: string().min(3).required(),
          }
        : {
          username: string().min(3).required(),
          password: passwordValidation,
          },
    );
  };

  const handleSubmit = (e: BaseSyntheticEvent) => {
    e.preventDefault()
    try {
      const inputs = e.target.elements;
      let forValidation = {
        username: inputs.username?.value,
        email: inputs.email?.value,
        password: inputs.password?.value,
        confirmPassword: inputs.ConfirmPassword?.value,
      };
      if (
        type === "sign-up" &&
        forValidation.confirmPassword !== forValidation.password
      ) {
        throw new Error("Passwords do not match");
      }
      authSchema()
        .validate(forValidation)
        .then(async () => {
          const res = await fetch(`http://127.0.0.1:8000/${type === 'sign-in' ?"login/":"signup/"}`,{
            method: 'POST',
            body: JSON.stringify(forValidation),
            headers:{
              'Content-Type': 'application/json',
            }
          });
          if (!res.ok) {
            let dataError = await res.json();
            setValidationError(dataError)
            return;
          }
          const data = await res.json();
          if (data?.error) {
            return
          }
          const token = data.token;
          localStorage.setItem('token', token);
          setUser(data.user);
           nav('/');
        })
        .catch((error: yup.ValidationError) => {
          console.log(error);
          setValidationError(error);
          return
        });
    } catch (error: any) {
      setValidationError(error);
    }
  };

  return (
    <div className="flex items-center justify-center mt-20">
      <div className=" w-1/3">
        <form
          className="text-foreground flex w-full flex-col justify-center gap-1"
          onSubmit={(e) => handleSubmit(e)}
        >
            <div className="flex flex-col gap-1">
              <label className="text-md" htmlFor="username">
                Name
              </label>
              <section className="mb-6">
                <input
                  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-md outline-none focus:border-blue-600 w-full p-3"
                  name="username"
                  placeholder="Mary Popins"
                  required
                />
              </section>
            </div>
            {type === "sign-up" && (
              <div className="flex flex-col gap-1">
                <label className="text-md" htmlFor="email">
                        Email
                      </label>
                      <section className="mb-6">
                        <input
                className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-md outline-none focus:border-blue-600 w-full p-3"
                name="email"
                required
                placeholder="you@example.com"
                        />
                      </section>
              </div>
            )}
      
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <section className="relative mb-6 flex items-center justifny-between">
            <input
              className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-md outline-none focus:border-blue-600 w-full p-3"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              required
            />
            <span className="absolute right-2.5 cursor-pointer">
              {showPassword ? (
                <AiOutlineEye
                  className="text-slate-900"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <AiOutlineEyeInvisible
                  className="text-slate-900"
                  onClick={() => setShowPassword(true)}
                />
              )}{" "}
            </span>
          </section>
            {type === "sign-up" && (
            <div className="flex flex-col gap-1">
              <label className="text-md" htmlFor="Confirm password">
                Confirm Password
              </label>
              <section className="relative mb-6 flex items-center justify-between ">
                <input
                  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-md outline-none focus:border-blue-600 w-full p-3"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  name="ConfirmPassword"
                  required
                />
                <span className="absolute right-2.5 cursor-pointer">
                  {showPassword ? (
                    <AiOutlineEye
                      className="text-slate-900"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <AiOutlineEyeInvisible
                      className="text-slate-900"
                      onClick={() => setShowPassword(true)}
                    />
                  )}{" "}
                </span>
              </section>
            </div>
          )}
          <p className="text-sm">
            {(type === "sign-in" ? "Not a user?" : "Login User?") + " "}
            <button
              className="text-blue-400"
              type="button"
              onClick={() => {
                type === "sign-in" ? setType("sign-up") : setType("sign-in");
              }}
            >
              {type === "sign-in" ? "sign-up" : "sign-in"}
            </button>
          </p>
          <button className="mb-2 rounded bg-gray-200 px-4 py-2">
            {type}
          </button>
          <Message validationError={validationError} />
        </form>
      </div>
    </div>
  );
};
