// The next three lines import custom components Component1, Component2, and Component3 from their respective files, and then register them as properties of the AdminBro.UserComponents object.

AdminBro.UserComponents = {} // This line creates an empty object called UserComponents within the AdminBro namespace, which will later be used to store custom components.

// line imports the Component1 React component from a file called admin-imgPath-component.js in the ../components/ directory.
import Component1 from '../components/admin-imgPath-component' 

// assigns the imported Component1 to the Component1 property within the UserComponents object, effectively registering it as a custom component that can be used within the AdminBro interface.
AdminBro.UserComponents.Component1 = Component1
import Component2 from '../components/admin-order-component'

// assigns the imported Component2 to the Component2 property within the UserComponents object, effectively registering it as a custom component that can be used within the AdminBro interface.
AdminBro.UserComponents.Component2 = Component2
import Component3 from '../components/admin-dashboard-component'

// assigns the imported Component3 to the Component3 property within the UserComponents object, effectively registering it as a custom component that can be used within the AdminBro interface.
AdminBro.UserComponents.Component3 = Component3