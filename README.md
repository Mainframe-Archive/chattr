# Chattr
>A minimal chat app ontop of swarm mutable resources.

The goal of this project is to simply demonstrate how chat can be done using Swarm Mutable Resource Updates (MRUs). Because of this, peer discovery is to be done out of band and is considered out of the scope of our intentions here. Aspects of this project may not end up being the most user-friendly, this is okay.

## Implementation

For peers to begin chatting, one must first create a channel. The channel data structure lists the identites of each participant. Once created, clients may watch this mutable resource to recieve updates when new identities join the channel.

The identites are (for now) a channel specific address hash of a mutable resource created by the owning peer. Clients observe each of these resources to recieve updated events.

## Getting Started
### Example User Flow
You and a friend launch chattr by navigating to bzz://example.eth which presumably resolves to this project hosted on swarm. You create a channel by giving it a name. You then will be given an address for your channel. You can then update the channel with a list of the identities that you'd like to participate in the channel. With the channel address now generated, you share it (out of band) with your friend(s). Your friends may now input the channel address, join the channel and begin chatting. 

## Road Map
### v0.1 
- [ ] Users may see their identity (to share it with a channel creator)
- [ ] Users may create a channel
- [ ] Users may add identities to a channel
- [ ] Users may join a channel
- [ ] Users may chat and observe updates of their active channel.
### v0.2
**TBD**


### Angular Details
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
