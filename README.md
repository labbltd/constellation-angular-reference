# Constellation Angular Reference

This project is a reference implementation for the Angular framework using the [Pega Constellation DX API](https://docs.pega.com/bundle/dx-api/page/platform/dx-api/dx-api-version-2-con.html), implemented on the [DX Accelerator](https://community.pega.com/marketplace/component/dx-accelerator). For further documentation on the DX accelerator, see the [API specification](https://labbltd.github.io/dx-accelerator/index.html).

The application is built on the following libraries:

- [Pega Constellation Core](https://www.npmjs.com/package/@pega/constellationjs) for communication with the DX API
- [Pega Constellation Core Types](https://www.npmjs.com/package/@labb/constellation-core-types) for powering the Constellation Core in TypeScript
- [DX Engine](https://www.npmjs.com/package/@labb/dx-engine) for bootstrapping and running the Constellation Core
- [Angular DX Adapter](https://www.npmjs.com/package/@labb/angular-adapter) for bridging the Angular framework to the DX Engine
- [Angular](https://www.npmjs.com/package/@angular/core) for the Angular framework

## Development server

Run `ng serve` for a dev server. Navigate to [http://localhost:4200/](http://localhost:4200) to view the application.

The project is configured to communicate with a Pega mocking server running on `localhost:3333` but can be changed to talk directly to a live Pega Infinity server.

## Development

The main entry point is the [src/pega/pega.component.ts](src/pega/pega.component.ts) which uses the [OAuth2Service](https://labbltd.github.io/dx-accelerator/classes/_labb_dx_engine.OAuth2Service.html) to authenticate with a server and uses the [PegaEntryCompent](https://labbltd.github.io/dx-accelerator/classes/_labb_angular_adapter.PegaEntryComponent.html) which bootstraps the Constellation Core and starts a new case type.

Bootstrapping the constellation core makes the [PCore class](https://labbltd.github.io/dx-accelerator/classes/_labb_constellation_core_types.PCore.html) globally available on the window.

The main mapping module is available at [src/pega/pega.mapping.module.ts](src/pega/pega.mapping.module.ts). A minimal setup would be when only the `default` mapping is configured. In this minimal setup the x-ray feature can be used by executing `window.PCore.getDebugger().toggleXRay(true)` in the browser console. Enabling X-Ray will show for each container the componentName and a unique counter for that container. Use the componentName as a key in the mapping module. E.g. when X-Ray shows a specific container as `Dropdown.67`, then add the following mapping to add an implementation for all containers of type `Dropdown`:

```TypeScript
providers: [
    {
      provide: DYNAMIC_CONTAINERS,
      useValue: {
        Dropdown: DxDropdownComponent
      }
    }
]
```

Not all containers need an implementation. A fallback to a default implementation is sufficient for most containers. Only when a special presentation of the container state or when user interaction is desired, then a specialized DX container implementation can be added.

Implementing DX Components is as easy as creating an Angular Component and extending from the [PContainerComponent](https://labbltd.github.io/dx-accelerator/classes/_labb_angular_adapter.PContainerComponent.html) class. The DX Angular Adapter will instantiate the correct class and make a [PContainer](https://labbltd.github.io/dx-accelerator/classes/_labb_dx_engine.PContainer.html) available on the `container` property.

```TypeScript
@Component({
  selector: 'dx-dropdown-component',
  template: `
    <label>
      {{ container.config.label }}
      ...
      {{ container.config.helperText }}
      {{ container.config.validatemessage }}
    </label>
  `,
})
export class DxDropdownComponent extends PContainerComponent {}
```

With X-Ray enabled, selecting a container in the browser will open a window which shows the state of that container. The configuration properties can be accessed in the Angular DX Component by reading from the `container.config` object. The [PConnect object](https://labbltd.github.io/dx-accelerator/classes/_labb_constellation_core_types.PConnect.html) associated with each container is available on `container.pconnect`.

The config object shape depends on the container type. To get IDE support, the config object shape can be passed in the PContainer. Available config object shapes can be viewed at the [API documentation](https://labbltd.github.io/dx-accelerator/hierarchy.html#@labb/constellation-core-types.DefaultProps).

```TypeScript
class DxDropdownComponent extends PContainerComponent<PContainer<PickListProps>>
```

The [PContainer class](https://labbltd.github.io/dx-accelerator/classes/_labb_dx_engine.PContainer.html) has utility methods available for writing changes back into Pega, such as `container.updateFieldValue(...)` and `container.triggerFieldChange(...)`. Specialized containers might have other properties and methods available which aid in retrieving and updating state for that container. See the [API specification](https://labbltd.github.io/dx-accelerator/hierarchy.html#@labb/dx-engine.PContainer) for an overview of specialized containers. When a specialized container is available in the DX Engine, this can be specified using generics.

```TypeScript
class FlowContainerComponent extends PContainerComponent<FlowContainer>
```

E.g. when implementing the [FlowContainer](https://labbltd.github.io/dx-accelerator/classes/_labb_dx_engine.FlowContainer.html), special properties and methods are available such as `container.actionButtons` and `container.buttonClick(...)`.
