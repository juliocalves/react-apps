const menuItems = {
    cms: [
      { id: "", label: "Dashboard", icon: "home" },
      { id: "aparencia", label: "Aparência do Site", icon: "palette" },
    ],
    produtos: [
      { id: "", label: "Dashboard", icon: "home" },
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
  