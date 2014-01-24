package ca.cybera.netmap.service;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.springframework.stereotype.Service;

import ca.cybera.netmap.model.ConnectionSpeed;
import ca.cybera.netmap.model.Network;
import ca.cybera.netmap.model.Organization;
import ca.cybera.netmap.model.OrganizationDisplay;
import ca.cybera.netmap.model.OrganizationType;

import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.io.WKTReader;

@Service
public class NetmapLoader {

	@Inject
	private OrganizationService organizationService;
	@Inject
	private NetworkConnectionService networkConnectionService;

	@PostConstruct
	public void load() {

		loadInitialOrganizationTypes();
		loadInitialOrganization();
		loadInitialNetworks();
		loadInitialConnectionSpeeds();

		loadInitialOrgDisplay();
	}

	private void loadInitialOrganizationTypes() {

		if (organizationService.getTypes().size() > 0) return;
		
		try {
			organizationService.save(new OrganizationType("K-12", "#3CDE1F"));
		} catch (Exception e) {
		}

		try {
			organizationService.save(new OrganizationType("PSI", "#FA0526"));
		} catch (Exception e) {
		}

		try {
			organizationService.save(new OrganizationType("Non for Profit", "#0577FA"));
		} catch (Exception e) {
		}

		try {
			organizationService.save(new OrganizationType("For Profit", "#030303"));
		} catch (Exception e) {
		}

	}

	private void loadInitialOrganization() {
		if (organizationService.get().size() > 0) return;
		
		try {
			Organization o = new Organization();
			
			WKTReader reader = new WKTReader();
			Geometry geom = reader.read("POINT(-114.02 51.11)");
			
			o.setGeom(geom);
			
			organizationService.save(o);
		} catch(Exception e) {
			
		}
	}
	
	private void loadInitialNetworks() {
		if (networkConnectionService.getNetworks().size() > 0) return;
		
		try {
			networkConnectionService.save(new Network("CyberaNet", "#FA0526"));
		} catch (Exception e) {
		}

		try {
			networkConnectionService.save(new Network("Westgrid", "#3CDE1F"));
		} catch (Exception e) {
		}

		try {
			networkConnectionService.save(new Network("CANARIE", "#0577FA"));
		} catch (Exception e) {
		}

	}

	private void loadInitialConnectionSpeeds() {
		if (networkConnectionService.getConnectionSpeeds().size() > 0) return;
		
		try {
			networkConnectionService.save(new ConnectionSpeed("A", 0.5));
		} catch (Exception e) {}

		try {
			networkConnectionService.save(new ConnectionSpeed("10G", 1.0));
		} catch (Exception e) {}

		try {
			networkConnectionService.save(new ConnectionSpeed("10 GbE", 1.5));
		} catch (Exception e) {}

		try {
			networkConnectionService.save(new ConnectionSpeed("1 GbE", 2.0));
		} catch (Exception e) {}

		try {
			networkConnectionService.save(new ConnectionSpeed("250 MbE", 2.5));
		} catch (Exception e) {}

	
	}
	
	private void loadInitialOrgDisplay() {
		if (organizationService.getOrgDisplay().size() > 0) return;
		
		try {
			List<OrganizationDisplay> list = new ArrayList<OrganizationDisplay>();
			
			list.add(new OrganizationDisplay("name", true, 1));
			list.add(new OrganizationDisplay("frenchName", true, 2));
			list.add(new OrganizationDisplay("organizationType", true, 3));
			list.add(new OrganizationDisplay("website", true, 4));
			list.add(new OrganizationDisplay("campus", false, 5));
			list.add(new OrganizationDisplay("mainOrSubCampus", false, 6));
			list.add(new OrganizationDisplay("address", false, 7));
			list.add(new OrganizationDisplay("city", true, 8));
			list.add(new OrganizationDisplay("province", true, 9));
			list.add(new OrganizationDisplay("postalCode", false, 10));
			list.add(new OrganizationDisplay("phone", false, 11));
			list.add(new OrganizationDisplay("connected", false, 12));
			list.add(new OrganizationDisplay("comments", true, 13));
			list.add(new OrganizationDisplay("memberSince", false, 14));
			list.add(new OrganizationDisplay("notes", false, 15));
			
			organizationService.saveOrgDisplay(list);
		} catch (Exception e) {}
	}
}
