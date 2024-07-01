import React, { useContext, useState, useEffect, useRef } from "react";
import ToolsImg from "../assets/tools.jpg";
import TextField from "../components/TextField";
import { MdOutlineEmail } from "react-icons/md";
import PasswordField from "../components/PasswordField";
import Button from "../components/Button";
import { FaRegUser } from "react-icons/fa";
import { MdOutlinePhone } from "react-icons/md";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { SnackbarContext, SnackbarType } from "../contexts/SnackbarContext";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const navigate = useNavigate();
  const { createAccount } = useContext(AuthContext);
  const { showSnackbar } = useContext(SnackbarContext);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="flex flex-col h-screen justify-center items-start overflow-hidden relative">
      <img
        className="absolute -z-10 w-full h-full object-cover"
        src={ToolsImg}
        alt=""
      />
      <div className="h-[400px] flex flex-col justify-evenly items-stretch ml-32">
        {isLoading ? (
          <div className="flex flex-col justify-evenly items-center min-w-[300px]">
            <ClipLoader
              color={"#09BAB0"}
              loading={true}
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : (
          <>
            <TextField
              icon={<FaRegUser className="text-3xl ml-4" />}
              placeholder="Nom d'utilisateur"
              type="text"
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
            <TextField
              icon={<MdOutlinePhone className="text-3xl ml-4" />}
              placeholder="Numéro de téléphone"
              type="phone"
              onChange={(event) => {
                setPhoneNumber(event.target.value);
              }}
            />
            <TextField
              icon={<MdOutlineEmail className="text-3xl ml-4" />}
              placeholder="E-mail"
              type="email"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
            <PasswordField
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
            <Button
              text="Terminer"
              onClick={async () => {
                setIsLoading(true);
                try {
                  const response = await createAccount({
                    email: email,
                    password: password,
                    phoneNumber: phoneNumber,
                    name: name,
                  });
                  if (response.status === 200) {
                    showSnackbar(response.data.message, 3000);
                    navigate("/");
                  } else {
                    showSnackbar(
                      "échec de l'inscription",
                      5000,
                      SnackbarType.ERROR
                    );
                  }
                } catch (error) {
                  if (error.response.status !== 500) {
                    showSnackbar(
                      error.response.data.message,
                      5000,
                      SnackbarType.ERROR
                    );
                  } else {
                    showSnackbar(
                      "échec de l'inscription",
                      5000,
                      SnackbarType.ERROR
                    );
                  }
                }

                setIsLoading(false);
              }}
            />
            <Link to="/">
              <Button text="Retourner" />
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
