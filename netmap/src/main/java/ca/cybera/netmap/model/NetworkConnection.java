package ca.cybera.netmap.model;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;

import com.vividsolutions.jts.geom.Geometry;

@XmlRootElement
@Entity
@Table(name = "network_connection")
public class NetworkConnection {

	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	@Column(name = "UUID")
	private String UUID;

	@ManyToOne
	@JoinColumn(name = "network")
	private Network network;

	@ManyToOne
	@JoinColumn(name = "connection_speed")
	private ConnectionSpeed connectionSpeed;

	@OneToMany (fetch = FetchType.EAGER)
	@JoinTable(name = "network_connection_website", joinColumns = { @JoinColumn(name = "network_connection_uuid", referencedColumnName = "UUID") }, inverseJoinColumns = { @JoinColumn(name = "website_UUID", referencedColumnName = "UUID") })
	private List<Website> websites;

	@ManyToOne
	@JoinColumn(name = "org_start")
	private Organization start;

	@ManyToOne
	@JoinColumn(name = "org_end")
	private Organization end;

	@Type(type = "org.hibernate.spatial.GeometryType")
	@Column(name = "geom")
	private Geometry geom;

	public String getUUID() {
		return UUID;
	}

	public void setUUID(String uUID) {
		UUID = uUID;
	}

	public Network getNetwork() {
		return network;
	}

	public void setNetwork(Network network) {
		this.network = network;
	}

	public ConnectionSpeed getConnectionSpeed() {
		return connectionSpeed;
	}

	public void setConnectionSpeed(ConnectionSpeed connectionSpeed) {
		this.connectionSpeed = connectionSpeed;
	}

	public List<Website> getWebsites() {
		return websites;
	}

	public void setWebsites(List<Website> websites) {
		this.websites = websites;
	}

	public Organization getStart() {
		return start;
	}

	public void setStart(Organization start) {
		this.start = start;
	}

	public Organization getEnd() {
		return end;
	}

	public void setEnd(Organization end) {
		this.end = end;
	}

	public Geometry getGeom() {
		return geom;
	}

	public void setGeom(Geometry geom) {
		this.geom = geom;
	}

}
