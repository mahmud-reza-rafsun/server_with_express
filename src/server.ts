import app from "./app";
import config from "./config";

const uri = config;
const { port } = uri;

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})