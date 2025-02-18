/**
 * An object representing the menu items for different sections of the application.
 * Each section contains an array of menu items with their respective properties.
 * 
 * @type {Object}
 * @property {Array<Object>} cms - Menu items for the CMS section.
 * @property {Array<Object>} produtos - Menu items for the Produtos section.
 * @property {Array<Object>} clientes - Menu items for the Clientes section.
 * @property {Array<Object>} equipe - Menu items for the Equipe section.
 * 
 * @property {string} cms[].id - The unique identifier for the menu item.
 * @property {string} cms[].label - The display label for the menu item.
 * @property {string} cms[].icon - The icon associated with the menu item.
 * 
 * @property {string} produtos[].id - The unique identifier for the menu item.
 * @property {string} produtos[].label - The display label for the menu item.
 * @property {string} produtos[].icon - The icon associated with the menu item.
 * 
 * @property {string} clientes[].id - The unique identifier for the menu item.
 * @property {string} clientes[].label - The display label for the menu item.
 * @property {string} clientes[].icon - The icon associated with the menu item.
 * 
 * @property {string} equipe[].id - The unique identifier for the menu item.
 * @property {string} equipe[].label - The display label for the menu item.
 * @property {string} equipe[].icon - The icon associated with the menu item.
 */
const menuItems = {
    cms: [
      { id: "", label: "Dashboard", icon: "home" },
      { id: "aparencia", label: "Aparência do Site", icon: "palette" },
    ],
    produtos: [
      { id: "", label: "Dashboard", icon: "home" },
      { id: "vendas", label: "Vendas", icon: "money" },
      { id: "catalogo", label: "Catálogo", icon: "book" },
    ],
    clientes: [
      { id: "", label: "Dashboard", icon: "home" },
      { id: "pedidos", label: "Pedidos", icon: "book" },
      { id: "reservas", label: "Reservas", icon: "calendar" },
      { id: "mensagens", label: "Mensagens", icon: "messages" },
    ],
    equipe: [
      { id: "", label: "Dashboard", icon: "home" },
      { id: "colaboradores", label: "Colaboradores", icon: "person" },
      { id: "acessos", label: "Acessos", icon: "acess" },
    ],
  };
  
  const paginas = Object.entries(menuItems)
  .flatMap(([categoria, items]) => 
    items.map((item) => `${categoria} - ${item.label}`)
  );
  
  export { menuItems, paginas };
  