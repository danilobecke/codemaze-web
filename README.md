# Codemaze-Web (aka frontend)

Codemaze is an advanced platform specifically designed to enhance the programming education experience in higher education. Providing a virtual environment for code execution, Codemaze allows users to practice, test, and evaluate their programs across various programming languages. Furthermore, the software integrates powerful features including plagiarism detection reports, detailed logging capabilities, and Swagger documentation for easy reference. With support for adding programming languages, customizable configurations, and a flexible architecture built on Docker containers, Codemaze empowers both instructors and higher education students to collaboratively and efficiently explore the realm of programming.

**This is the suggested frontend to run with the [Codemaze](https://github.com/danilobecke/codemaze) backend.**

## Table of contents

1. [Prerequisites](#prereq)
2. [Deploy](#deploy)
	1. [Environment](#env-deploy)
    1. [Run deploy](#run-deploy)
5. [Contributing](#contr)
	1. [Running as debug](#debug)
1. [Stopping](#stop)
1. [License](#lic)
2. [Technologies](#tech)
1. [Contact Info](#contact)

<a name=prereq></a>
## Prerequisites

You must have installed in the host machine before deploying or in your local machine before running:

1. **Docker** - used to manage and host the app.

<a name=deploy></a>
## Deploy

Clone this repository in the host machine.

<a name=env-deploy></a>
### Environment

You have to create an environment file on the root directory named `.env` with keys for the API URL (if you haven't changed it when deploying [Codemaze](https://github.com/danilobecke/codemaze), it'll be `your_ip:8080`) and school name:

```bash
REACT_APP_API_URL="0.0.0.1:8080"
REACT_APP_SCHOOL_NAME="My School"
```

<a name=env-deploy></a>
### Run deploy:

```sh
make build
make deploy
```

By doing this, Codemaze-Web will be running in the `:80` port. You can customize the port updating the [Makefile](./Makefile).

<a name=contr></a>
## Contributing

You can run Codemaze-Web locally for debugging and testing purposes.

<a name=debug></a>
### As debug (localhost:3000)

Navigate to the root folder and run:

```bash
make build-debug
make debug
```

You must have a `.env` file in the same way as the [.env.deploy](#env-deploy) one.

<a name=stop></a>
## Stopping

To stop and remove the Docker containers, you can run:

```bash
make stop-deploy # if deploy
make stop-debug # if debugging
```

<a name=lic></a>
## License

Introduced by Danilo Cleber Becke in 2023, the BSD 2-Clause License outlines the terms under which the software can be utilized and distributed. Users are free to modify the software, as long as they adhere to two main conditions: 1) they must include the original copyright notice and a list of conditions, and 2) if they distribute the software in binary form, they must reproduce the copyright notice and conditions in the documentation or accompanying materials. The copyright holder and contributors are not liable for any direct, indirect, incidental, consequential, or other damages arising from the use of the software, regardless of the legal theory applied.

<a name=tech></a>
## Technologies

Developed using [React](https://react.dev) with [TypeScript](https://www.typescriptlang.org).

- [@altostra/type-validations](https://www.npmjs.com/package/@altostra/type-validations)
- [dayjs](https://www.npmjs.com/package/dayjs)
- [i18next](https://www.npmjs.com/package/i18next)
- [i18next-browser-languagedetector](https://www.npmjs.com/package/i18next-browser-languagedetector)
- [@mui/icons-material](https://www.npmjs.com/package/@mui/icons-material)
- [@mui/material](https://www.npmjs.com/package/@mui/material)
- [@mui/x-charts](https://www.npmjs.com/package/@mui/x-charts)
- [@mui/x-date-pickers](https://www.npmjs.com/package/@mui/x-date-pickers)
- [react-i18next](https://react.i18next.com)
- [react-router-dom](https://www.npmjs.com/package/react-router-dom)

<a name=contact></a>
## Contact Info

You can reach me at [danilobecke@gmail.com](mailto:danilobecke@gmail.com) and [http://linkedin.com/in/danilobecke/](http://linkedin.com/in/danilobecke/).
