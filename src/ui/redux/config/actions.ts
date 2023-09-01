import { createAction } from "@reduxjs/toolkit";

const setUseProxy = createAction<boolean>("config/SET_USE_PROXY");
const setProxy = createAction<ProxyOption | undefined>("config/SET_PROXY");

export default { setUseProxy, setProxy };
