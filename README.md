# VSounds Module
A shared module designed to provide reusable audio and procedural graphics utilities for simulations.

## Features

- Shared audio synthesis and procedural graphics utilities
- Modular design to support multiple simulations
- Easy local development with `npm link`
- Ready for future versioned releases via npm

## Getting Started

### 1. Clone the module
```bash
git clone git@github.com:volatilesounds/vsounds-module.git
cd vsounds-module
```

### 2. Local development with simulations

You can link this module to a simulation for local testing:

```bash
# Inside vsounds-module
npm link

# Inside your simulation project
npm link vsounds-module
```

The simulation will now use the local version of vsounds-module. Any changes you make to the module will be immediately available in the simulation.

### 3. Using as a Git submodule

For each simulation, you can track a specific version or commit of vsounds-module:

```bash
# Inside the simulations repository
git submodule add git@github.com:volatilesounds/vsounds-module.git path/to/vsounds-module
git submodule update --init --recursive
git commit -m "Add vsounds-module submodule"
```

Update the submodule to a specific tag or commit if different simulations require different versions:

```bash
cd path/to/vsounds-module
git fetch --tags
git checkout v1.1.0  # or any desired commit/tag
cd ../..
git add path/to/vsounds-module
git commit -m "Update vsounds-module to v1.1.0 for this simulation"
```

### 4. Future npm Usage

Once ready, vsounds-module can be published as a private npm package, allowing simulations to install it by version:

```bash
npm install @volatilesounds/vsounds-module@1.1.0
```

This approach will simplify version management and remove the need for submodules during deployment.

## Versioning

The module uses Git tags for releases, following semantic versioning:
- v1.0.0 – initial stable release
- v1.1.0 – minor updates
- v2.0.0 – breaking changes

Each simulation can point to a specific tag/commit to ensure compatibility.
