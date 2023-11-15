import React, {useState} from "react";
// import styled from "styled-components";
import "./navbar.css";
import { Link, useLocation } from "react-router-dom";
import { render } from "@testing-library/react";

const KLPSST_Bar = ({}) => {

    const page = useLocation(); //gets what pg ure on
    const pages = ['Home', 'Login']

    return (
        <div id = "test">
            {pages.map((pageTitle) => (
                <Link
                    key = {pageTitle}
                    to={`/${pageTitle.toLowerCase()}`}
                    className={page.pathname === `/${pageTitle.toLowerCase()}` ? 'active' : ''}
                >
                    {pageTitle}
                </Link>
            ))}
        </div>
    );
}

export default KLPSST_Bar;