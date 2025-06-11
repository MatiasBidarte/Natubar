"use client";
import React from "react";

const Login = () => {
  localStorage.setItem(
    "usuario",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNsaWVudGVAZWplbXBsby5jb20iLCJvYnNlcnZhY2lvbmVzIjoiQ2xpZW50ZSBmcmVjdWVudGUiLCJkZXBhcnRhbWVudG8iOiJDYW5lbG9uZXMiLCJjaXVkYWQiOiJMYXMgUGllZHJhcyIsImRpcmVjY2lvbiI6IkF2LiBBcnRpZ2FzIDEyMyIsInRlbGVmb25vIjoiMDkyMTIzNDU2IiwiZGlzY3JpbWluYWRvciI6IlBlcnNvbmEiLCJub21icmUiOiJKdWFuIiwiYXBlbGxpZG8iOiJQJUMzJUIzcmV6IiwiaWF0IjoxNzE3NzU2Nzc2LCJleHAiOjE3MTc3NjAzNzZ9.0EbYkcJChJCR15FkgQqRFAs-oMEtnYHEYhdz5BsbnNw"
  );
  return <div>Login</div>;
};

export default Login;
