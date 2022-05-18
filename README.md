# IoW Boundary Tool

#TODO Update This
*Project description*

### Requirements

* Vagrant 2.2+
* VirtualBox 6.0+
* Ansible 2.9+

### Getting Started

Install the application and all required dependencies.

```sh
./scripts/setup
```

#### Development

Rebuild Docker images and run application.

```sh
vagrant up
vagrant ssh
./scripts/update
./scripts/server
```

### Ports

| Service            | Port                            |
| ------------------ | ------------------------------- |
| Webpack Dev Server | [`4545`](http://localhost:4567) |

### Testing

```
./scripts/test
```

### Scripts

| Name           | Description                                                   |
| -------------- | ------------------------------------------------------------- |
| `cibuild`      | Build project for CI                                          |
| `clean`        | Free disk space by cleaning up dangling Docker images         |
| `console`      | Run interactive shell inside application container            |
| `lint`         | Lint source code                                              |
| `server`       | Run Docker Compose services                                   |
| `setup`        | Provision Vagrant VM and run `update`                         |
| `test`         | Run unit tests                                                |
| `update`       | Build Docker images                                           |

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
