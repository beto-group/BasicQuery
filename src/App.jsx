// Basic Query - Application Bootstrap Core
// Version: 1.0.1

async function AppModule({ folderPath, dc }) {
  const { View } = await dc.require(folderPath + "/src/BasicQuery.component.jsx");
  return { View };
}

return AppModule;
