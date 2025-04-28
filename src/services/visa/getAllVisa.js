const getAllVisa = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/countries/visa`
      );
      const propertyPackages = await response.json();
      console.log(propertyPackages)
      
      return propertyPackages;
    } catch (error) {
      return [];
    }
  };
  
  export default getAllVisa;
  