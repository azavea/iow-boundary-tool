# IoW Boundary Tool

#TODO Update This
*Project description*

### Requirements
The app is built using Docker. On Intel Macs, Docker can be used natively or
from within a Linux environment, which can be virtualized using Vagrant,
VirtualBox, and Ansible:

* Vagrant 2.2+
* VirtualBox 6.0+
* Ansible 2.9+

On Apple Silicon Macs, and on Linux hosts, all you need is Docker.

### Getting Started

Install the application and all required dependencies.
For Vagrant-based development, use:

```console
./scripts/setup --vagrant
```

For Docker-based development, use:

```console
./scripts/setup --docker
```

Municipal data can be downloaded with a script:

```console
./scripts/fetch-data
```

#### Development

Rebuild Docker images and run application.

```sh
vagrant up
vagrant ssh
./scripts/update
./scripts/server
```

After running `setup` (or `resetdb`), three test users are created:

| User                 | Password          | Role          |
| ---------------------|-------------------|---------------|
| a1@azavea.com        | password          | administrator |
| v1@azavea.com        | password          | validator     |
| c1@azavea.com        | password          | contributor   |

### Ports

| Service            | Port                            |
| --------------------------| ------------------------------- |
| Webpack Dev Server        | [`4545`](http://localhost:4545) |
| Gunicorn for Django app   | [`8181`](http://localhost:8181) |

### Testing

```
./scripts/test
```

### Scripts
For Vagrant-based development environments, run `setup` on your host, and all
other scripts inside the Vagrant VM. For Docker-based development environments,
all scripts should be run from the host.

| Name           | Description                                                   |
| -------------- | ------------------------------------------------------------- |
| `cibuild`      | Build project for CI                                          |
| `clean`        | Free disk space by cleaning up dangling Docker images         |
| `console`      | Run interactive shell inside application container            |
| `lint`         | Lint source code                                              |
| `server`       | Run Docker Compose services                                   |
| `setup`        | Provision Vagrant VM and run `update` and `resetdb`           |
| `test`         | Run unit tests                                                |
| `update`       | Build Docker images                                           |
| `resetdb`      | Restore development database to defaults (with test data)     |

### Adding NPM Packages

To add a new NPM package to the project:

- Manually add the package to the project's `package.json` file, ensuring that you
pin it to a specific version.
- Run `./scripts/update` in the VM.
- Commit the changes to the following files to git:
    - `package.json`
    - `yarn.lock`

#### Notes

* We usually pin packages to a specific version to minimize build errors.
* For packages in the regular/non-dev dependencies section of `package.json`,
  manually add the package name to the `vendor` array in `webpack.config.json`
