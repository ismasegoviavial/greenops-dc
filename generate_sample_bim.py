import xml.etree.ElementTree as ET
import random

def generate_datacenter_gbxml(filename="datacenter_100racks.xml"):
    # Create the root element for gbXML
    root = ET.Element("gbXML", {
        "xmlns": "http://www.gbxml.org/schema",
        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "xsi:schemaLocation": "http://www.gbxml.org/schema http://www.gbxml.org/schema/gbXML_v6.01.xsd",
        "version": "6.01",
        "temperatureUnit": "F",
        "lengthUnit": "Feet"
    })
    
    # Campus
    campus = ET.SubElement(root, "Campus", {"id": "campus-santiago"})
    ET.SubElement(campus, "Name").text = "Santiago Centro Data Center Campus"
    
    # Building
    building = ET.SubElement(campus, "Building", {
        "id": "bldg-01",
        "buildingType": "DataCenter"
    })
    ET.SubElement(building, "Name").text = "Main Server Facility Building"
    ET.SubElement(building, "Area").text = "15000"
    
    # Space (Server Room)
    space = ET.SubElement(building, "Space", {
        "id": "space-server-hall-01",
        "zoneId": "zone-cooling-primary"
    })
    ET.SubElement(space, "Name").text = "Main Server Hall - High Density Zone"
    ET.SubElement(space, "Volume").text = "180000"
    
    # Generate 100 Racks in 5 rows (Row A to E, 20 racks each)
    rows = ["A", "B", "C", "D", "E"]
    random.seed(42) # Consistent random values
    
    for row_letter in rows:
        for num in range(1, 21):
            rack_id = f"Rack-{row_letter}{num:02d}"
            
            # Mechanical equipment tag for each rack
            equipment = ET.SubElement(space, "Equipment", {
                "id": rack_id,
                "type": "ServerCabinet"
            })
            ET.SubElement(equipment, "Name").text = f"Server Cabinet {row_letter}-{num}"
            
            # Attributes for GreenOps parser
            ET.SubElement(equipment, "PowerLoad", {
                "unit": "kW",
                "value": f"{random.uniform(3.5, 8.0):.2f}"
            })
            ET.SubElement(equipment, "FlowRate", {
                "unit": "L/s",
                "value": f"{random.uniform(0.18, 0.40):.3f}"
            })
            ET.SubElement(equipment, "PduIp").text = f"192.168.10.{rows.index(row_letter)*20 + num}"
            
            # Thermal efficiency baseline status
            status = "normal" if random.random() > 0.15 else ("warning" if random.random() > 0.5 else "critical")
            ET.SubElement(equipment, "Status").text = status
            ET.SubElement(equipment, "Temperature").text = f"{random.randint(64, 82)}°F"
            
    # Add Cooling loop components
    cooling_system = ET.SubElement(space, "CoolingSystem", {"id": "chw-primary-loop"})
    
    # Chillers
    for i in range(1, 4):
        chiller = ET.SubElement(cooling_system, "Chiller", {"id": f"chiller-0{i}"})
        ET.SubElement(chiller, "Name").text = f"Central Chiller Unit {i}"
        ET.SubElement(chiller, "Capacity", {"unit": "kW"}).text = "500"
        ET.SubElement(chiller, "Status").text = "Running" if i != 2 else "Standby"
        
    # Pumps
    for i in range(1, 5):
        pump = ET.SubElement(cooling_system, "Pump", {"id": f"pump-0{i}"})
        ET.SubElement(pump, "Name").text = f"Chilled Water Pump PUP-{i}"
        ET.SubElement(pump, "Status").text = "Running" if i % 2 != 0 else "Off"
        
    # Indent XML structure for readability
    indent(root)
    
    # Write to file
    tree = ET.ElementTree(root)
    tree.write(filename, encoding="utf-8", xml_declaration=True)
    print(f"BIM gbXML file generated successfully: {filename}")

def indent(elem, level=0):
    i = "\n" + level*"  "
    if len(elem):
        if not elem.text or not elem.text.strip():
            elem.text = i + "  "
        if not elem.tail or not elem.tail.strip():
            elem.tail = i
        for elem in elem:
            indent(elem, level+1)
        if not elem.tail or not elem.tail.strip():
            elem.tail = i
    else:
        if level and (not elem.tail or not elem.tail.strip()):
            elem.tail = i

if __name__ == "__main__":
    generate_datacenter_gbxml()
