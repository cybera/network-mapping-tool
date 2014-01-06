package ca.cybera.netmap.service;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.springframework.stereotype.Service;

import ca.cybera.netmap.model.ConnectionSpeed;
import ca.cybera.netmap.model.Network;
import ca.cybera.netmap.model.Organization;
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

	}

	private void loadInitialOrganizationTypes() {

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
}
