import fs from 'fs';

export function storeData(dataPath: string, newData: any) {
  fs.readFile(dataPath, (err, fileData) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      return;
    }
    let json;
    try {
      json = JSON.parse(fileData.toString());
    } catch (parseError) {
      console.error(`Error parsing JSON from file: ${parseError}`);
      return;
    }
    json.push(newData);

    fs.writeFile(dataPath, JSON.stringify(json, null, 2), (writeErr) => {
      if (writeErr) {
        console.error(`Error writing file: ${writeErr}`);
      } else {
        console.log(`New token data stored successfully.`);
      }
    });
  });
}
