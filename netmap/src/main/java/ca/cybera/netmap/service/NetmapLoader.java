package ca.cybera.netmap.service;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.springframework.stereotype.Service;

import ca.cybera.netmap.model.ConnectionSpeed;
import ca.cybera.netmap.model.Network;
import ca.cybera.netmap.model.OrganizationType;

@Service
public class NetmapLoader {

	@Inject
	private OrganizationService organizationService;
	@Inject
	private NetworkConnectionService networkConnectionService;

	@PostConstruct
	public void load() {

		loadInitialOrganizationTypes();
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
			networkConnectionService.save(new ConnectionSpeed("A", 1.0));
		} catch (Exception e) {}

		try {
			networkConnectionService.save(new ConnectionSpeed("10G", 1.0));
		} catch (Exception e) {}

		try {
			networkConnectionService.save(new ConnectionSpeed("10 GbE", 1.0));
		} catch (Exception e) {}

		try {
			networkConnectionService.save(new ConnectionSpeed("1 GbE", 1.0));
		} catch (Exception e) {}

		try {
			networkConnectionService.save(new ConnectionSpeed("250 MbE", 1.0));
		} catch (Exception e) {}

	
	}
}
