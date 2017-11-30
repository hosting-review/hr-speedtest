<?php

class HRSpeedTest_REST_Controller {
    /**
	 * Instance of this class.
	 *
	 * @since    0.8.1
	 *
	 * @var      object
	 */
	protected static $instance = null;

	/**
	 * Initialize the plugin by setting localization and loading public scripts
	 * and styles.
	 *
	 * @since     0.8.1
	 */
	private function __construct() {
	}

    /**
     * Set up WordPress hooks and filters
     *
     * @return void
     */
    public function do_hooks() {
        add_action( 'rest_api_init', array( $this, 'register_routes' ) );
    }

	/**
	 * Return an instance of this class.
	 *
	 * @since     0.8.1
	 *
	 * @return    object    A single instance of this class.
	 */
	public static function get_instance() {

		// If the single instance hasn't been set, set it now.
		if ( null == self::$instance ) {
			self::$instance = new self;
			self::$instance->do_hooks();
		}

		return self::$instance;
	}

    /**
     * Register the routes for the objects of the controller.
     */
    public function register_routes() {
        $version = '1';
        $namespace = 'hr-speedtest/v' . $version;

        register_rest_route( $namespace, '/settings/', array(
            array(
                'methods'               => WP_REST_Server::READABLE,
                'callback'              => array( $this, 'get_settings' ),
                'permission_callback'   => array( $this, 'setting_permissions_check' ),
                'args'                  => array(),
            ),
        ) );

        register_rest_route( $namespace, '/settings/', array(
            array(
                'methods'               => WP_REST_Server::CREATABLE,
                'callback'              => array( $this, 'update_settings' ),
                'permission_callback'   => array( $this, 'setting_permissions_check' ),
                'args'                  => array(),
            ),
        ) );

	    register_rest_route( $namespace, '/test/(?P<limit>\d+)', array(
		    array(
			    'methods'               => WP_REST_Server::READABLE,
			    'callback'              => array( $this, 'get_recent' ),
			    //'permission_callback'   => array( $this, 'setting_permissions_check' ),
			    'args'                  => array(
				    'limit' => array(
					    'validate_callback' => 'is_numeric'
				    ),
			    ),
		    ),
	    ) );

	    register_rest_route( $namespace, '/test', array(
		    array(
			    'methods'               => WP_REST_Server::READABLE,
			    'callback'              => array( $this, 'get_recent' ),
			    //'permission_callback'   => array( $this, 'setting_permissions_check' ),
			    'args'                  => array(
				    'limit' => array(
					    'validate_callback' => 'is_numeric'
				    ),
			    ),
		    ),
	    ) );

	    register_rest_route( $namespace, '/test/', array(
		    array(
			    'methods'               => WP_REST_Server::CREATABLE,
			    'callback'              => array( $this, 'add_recent' ),
			    //'permission_callback'   => array( $this, 'setting_permissions_check' ),
			    'args'                  => array(),
		    ),
	    ) );

    }

    /**
	 * Get Settings
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Request
	 */
	public function get_settings( $request ) {
		global $wpdb;

		$data = array(
			'hrspeedtest' => get_option('hrspeedtest'),
		);

		return new WP_REST_Response( $data, 200 );
	}

	/**
	 * Update Settings
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Request
	 */
	public function update_settings( $request ) {
		update_option('hrspeedtest', $request->get_param('hrspeedtest'));
		return new WP_REST_Response( true, 200 );
	}

	/**
	 * Get Recent
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Request
	 */
	public function get_recent( $request ) {
		global $wpdb;
		$limit = $request->get_param('limit');
		$query = 'SELECT * FROM `'. $wpdb->prefix .'speed_tests` ORDER BY `updated` DESC';
		if(!empty($limit)){
			$query = $wpdb->prepare('SELECT * FROM `'. $wpdb->prefix .'speed_tests` ORDER BY `updated` DESC LIMIT %d', $limit);
		}

		$results = [];
		foreach ($wpdb->get_results($query, ARRAY_A) as $key => $result) {
			$results[$key] = $result;
			$datetime_now = new DateTime("now");
			$datetime_created = new DateTime($result['created']);

			$interval = $datetime_now->getTimestamp() - $datetime_created->getTimestamp();

			$results[$key]['serverAgoInSeconds'] = $interval;
		}

		$data = array(
			'hrspeedtest' => get_option('hrspeedtest'),
			'recent' => $results
		);

		return new WP_REST_Response( $data, 200 );
	}

	/**
	 * Add Recent
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|WP_REST_Request
	 */
	public function add_recent( $request ) {
		global $wpdb;

		$results = $request->get_body();
		$ip = $request->get_header('x_real_ip');
		$url = $request->get_json_params()['websiteUrl'];
		$user_time_created = $request->get_json_params()['user_time_created'];
		$timezone = $request->get_json_params()['timezone'];

		try {
			$wpdb->insert( $wpdb->prefix . 'speed_tests', [
				'url'     => $url,
				'ip'      => $ip,
				'results' => $results,
				'user_time_created' => $user_time_created,
				'user_time_zone' => $timezone,
				'created' => date('Y-m-d H:i:s')
			], [
				'%s',
				'%s',
				'%s',
				'%s',
				'%s',
				'%s'
			] );
		} catch (Exception $e){
			return new WP_REST_Response( $e, 417 );
		}

		return new WP_REST_Response( true, 200 );
	}

    /**
     * Check if a given request has access to update a setting
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|bool
     */
    public function setting_permissions_check( $request ) {
        return current_user_can( 'manage_options' );
    }

	/**
	 * Check if a given request has access to update a setting
	 *
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_Error|bool
	 */
	public function test_permissions_check( $request ) {
		return current_user_can( 'read' );
	}
}
