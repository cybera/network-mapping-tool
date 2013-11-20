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
			organizationService.save(new OrganizationType("K-12"));
		} catch (Exception e) {
		}

		try {
			organizationService.save(new OrganizationType("PSI"));
		} catch (Exception e) {
		}

		try {
			organizationService.save(new OrganizationType("Non for Profit"));
		} catch (Exception e) {
		}

		try {
			organizationService.save(new OrganizationType("For Profit"));
		} catch (Exception e) {
		}

	}

	private void loadInitialNetworks() {

		try {
			networkConnectionService.save(new Network("CyberaNet"));
		} catch (Exception e) {
		}

		try {
			networkConnectionService.save(new Network("Westgrid"));
		} catch (Exception e) {
		}

		try {
			networkConnectionService.save(new Network("CANARIE"));
		} catch (Exception e) {
		}

	}

	private void loadInitialConnectionSpeeds() {

		try {
			networkConnectionService.save(new ConnectionSpeed("A"));
		} catch (Exception e) {}

		try {
			networkConnectionService.save(new ConnectionSpeed("10G"));
		} catch (Exception e) {}

		try {
			networkConnectionService.save(new ConnectionSpeed("10 GbE"));
		} catch (Exception e) {}

		try {
			networkConnectionService.save(new ConnectionSpeed("1 GbE"));
		} catch (Exception e) {}

		try {
			networkConnectionService.save(new ConnectionSpeed("250 MbE"));
		} catch (Exception e) {}

	
	}
}
