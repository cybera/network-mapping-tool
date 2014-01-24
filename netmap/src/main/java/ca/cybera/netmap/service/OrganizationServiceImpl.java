package ca.cybera.netmap.service;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ca.cybera.netmap.model.Organization;
import ca.cybera.netmap.model.OrganizationDisplay;
import ca.cybera.netmap.model.OrganizationType;

import com.vividsolutions.jts.geom.GeometryFactory;

import de.micromata.opengis.kml.v_2_2_0.Coordinate;
import de.micromata.opengis.kml.v_2_2_0.Feature;
import de.micromata.opengis.kml.v_2_2_0.Folder;
import de.micromata.opengis.kml.v_2_2_0.Geometry;
import de.micromata.opengis.kml.v_2_2_0.Kml;
import de.micromata.opengis.kml.v_2_2_0.Placemark;
import de.micromata.opengis.kml.v_2_2_0.Point;

@Service
@Transactional
public class OrganizationServiceImpl implements OrganizationService {
	GeometryFactory gf = new GeometryFactory();

	@PersistenceContext
	private EntityManager entityManager;

	@Override
	public Organization get(String uuid) {

		return entityManager.find(Organization.class, uuid);

	}

	@Override
	public Organization save(Organization organization) {
		
		return entityManager.merge(organization);

	}

	@Override
	public void delete(String uuid){
		entityManager.remove(get(uuid));
	}

	@Override
	public List<Organization> get() {

		return entityManager.createQuery("select o from Organization o", Organization.class).getResultList();

	}

	@Override
	public void  importKML(InputStream is) throws Exception {
		
		StringBuffer buf = new StringBuffer();
		BufferedReader br = new BufferedReader(new InputStreamReader(is));
		String ln;
		while((ln=br.readLine())!= null) {
			buf.append(ln);
		}
		String kmlinput = buf.toString();
		kmlinput = kmlinput.replaceAll("http://earth.google.com/kml/2.2", "http://www.opengis.net/kml/2.2");
		
		System.out.println("load: "+kmlinput);
		
		Kml kml = Kml.unmarshal(kmlinput);
		parseKMLFeature(kml.getFeature());
	}

	private void parseKMLFeature(Feature f) throws Exception {
		if (f instanceof de.micromata.opengis.kml.v_2_2_0.Document) {
			de.micromata.opengis.kml.v_2_2_0.Document doc = (de.micromata.opengis.kml.v_2_2_0.Document) f;

			List<Feature> docFeatures = doc.getFeature();
			for (Feature docFeature : docFeatures) {
				parseKMLFeature(docFeature);
			}
		} else if (f instanceof Folder) {
			Folder folder = (Folder) f;
			List<Feature> folderFeatures = folder.getFeature();
			for (Feature folderFeature : folderFeatures) {
				parseKMLFeature(folderFeature);

			}
		} else if (f instanceof Placemark) {
			Placemark p = (Placemark) f;
			
			addPlacemarkAsOrg(p);
		}
	}

	private String getComponent(List<String> components, int pos) {
		String ret = null;
		if(pos < components.size()) {
			ret = components.get(pos).trim();
			
			if(ret.length() >= 255) {
				System.out.println("\n\n\n*********************************************************************************************\n\n\n");
			}
				
			System.out.println("ret: "+ret+" -> "+ret.length());
			
			
		}

		
		return ret;
	}
	
	private void addPlacemarkAsOrg(Placemark p) throws Exception {
		Geometry g = p.getGeometry();

		Organization o = new Organization();
		o.setName(p.getName());
		o.setAddress(p.getAddress());
		o.setPhone(p.getPhoneNumber());
		
		String desc = p.getDescription();
		if(desc != null){
			String[] toks = desc.split(",");
			
			List<String> components = Arrays.asList(toks);
			Collections.reverse(components);
			
			o.setPostalCode(getComponent(components, 0));
			o.setProvince(getComponent(components, 1));
			o.setCity(getComponent(components, 2));
			o.setAddress(getComponent(components, 3));
			System.out.println(desc);
			System.out.println(desc.length());
		}
		
		 if(g instanceof Point) {
				Point point = (Point)g;
				List<Coordinate> coords = point.getCoordinates();
				
				o.setGeom(gf.createPoint(getJTSCoordinates(point.getCoordinates())[0]));
			}
		 else {
			 throw new Exception("Geometry must be a point in order to import as an Organization");
		 }
		 
		 System.out.println(o);
		 save(o);
	}
	
	private com.vividsolutions.jts.geom.Coordinate[] getJTSCoordinates(List<Coordinate> coords) {
		List<com.vividsolutions.jts.geom.Coordinate> jtsCoords = new ArrayList<>();
		for(Coordinate kmlCoord: coords) {
			jtsCoords.add(new com.vividsolutions.jts.geom.Coordinate(kmlCoord.getLongitude(), kmlCoord.getLatitude(), kmlCoord.getAltitude()));
		}

		return jtsCoords.toArray(new com.vividsolutions.jts.geom.Coordinate[]{});
	}

	
	@Override
	public List<Organization> get(OrganizationType type) {

		CriteriaBuilder builder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Organization> query = builder.createQuery(Organization.class);

		Root<Organization> root = query.from(Organization.class);
		query.where(builder.equal(root.get("organizationType"), type));

		return entityManager.createQuery(query).getResultList();

	}

	@Override
	public OrganizationType save(OrganizationType type) {

		return entityManager.merge(type);

	}

	@Override
	public List<OrganizationType> getTypes() {

		return entityManager.createQuery("select o from OrganizationType o", OrganizationType.class).getResultList();

	}
	
	@Override
	public void deleteType(String uuid){
		entityManager.remove(getType(uuid));
	}


	@Override
	public OrganizationType getType(String type) {

		return entityManager.find(OrganizationType.class, type);
		
	}

	
	@Override
	public List<OrganizationDisplay> getOrgDisplay() {

		return entityManager.createQuery("select o from OrganizationDisplay o  order by o.sortOrder", OrganizationDisplay.class).getResultList();

	}
	
	@Override
	public void saveOrgDisplay(List<OrganizationDisplay> displays) {
		for(OrganizationDisplay od : displays) {
			entityManager.merge(od);
		}
	}
	
	
}
