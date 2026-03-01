useEffect(() => {
  const token = getToken();
  if (token) {
    router.replace('/tasks'); // Antes /productos
  }
}, [router]);

// Al hacer login correcto
setTimeout(() => {
  router.replace('/tasks'); // Antes /productos
  router.refresh();
}, 800);