/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */

export type FlowProcessType = 'AutoLaunchedFlow'
| 'Flow'
| 'Workflow'
| 'CustomEvent'
| 'InvocableProcess'
| 'LoginFlow'
| 'ActionPlan'
| 'JourneyBuilderIntegration'
| 'UserProvisioningFlow'
| 'Survey'
| 'SurveyEnrich'
| 'Appointments'
| 'FSCLending'
| 'DigitalForm'
| 'FieldServiceMobile'
| 'OrchestrationFlow'
| 'FieldServiceWeb'
| 'TransactionSecurityFlow'
| 'ContactRequestFlow'
| 'ActionCadenceFlow'
| 'ManagedContentFlow'
| 'CheckoutFlow'
| 'CartAsyncFlow'
| 'OfflineFlow'
| 'CustomerLifecycle'
| 'Journey'
| 'RecommendationStrategy'
| 'Orchestrator'
| 'RoutingFlow'
| 'ServiceCatalogItemFlow'
| 'EvaluationFlow'
| 'LoyaltyManagementFlow'
| 'ManagedContentAuthoringWorkflow'
| 'ActionCadenceAutolaunchedFlow'
| 'ActionCadenceStepFlow'
| 'IndividualObjectLinkingFlow'
| 'PromptFlow';

export type PerfOption = 'NONE'
| 'MINIMUM';

export type LogCategory = 'Db'
| 'Workflow'
| 'Validation'
| 'Callout'
| 'Apex_code'
| 'Apex_profiling'
| 'Visualforce'
| 'System'
| 'Wave'
| 'Nba'
| 'All';

export type LogCategoryLevel = 'None'
| 'Finest'
| 'Finer'
| 'Fine'
| 'Debug'
| 'Info'
| 'Warn'
| 'Error';

export type LogType = 'None'
| 'Debugonly'
| 'Db'
| 'Profiling'
| 'Callout'
| 'Detail';

export type ID = string;

export interface CompileAndTestRequest {
	checkOnly: boolean;
	classes?: string | string[];
	deleteClasses?: string | string[];
	deleteTriggers?: string | string[];
	runTestsRequest?: RunTestsRequest;
	triggers?: string | string[];
}

export interface RunTestsRequest {
	allTests: boolean;
	classes?: string | string[];
	maxFailedTests?: number;
	namespace: string;
	packages?: string | string[];
	skipCodeCoverage?: boolean;
	tests?: TestsNode | TestsNode[];
}

export interface TestsNode {
	classId: string;
	className: string;
	testMethods?: string | string[];
}

export interface CompileAndTestResult {
	classes?: CompileClassResult | CompileClassResult[];
	deleteClasses?: DeleteApexResult | DeleteApexResult[];
	deleteTriggers?: DeleteApexResult | DeleteApexResult[];
	runTestsResult: RunTestsResult;
	success: boolean;
	triggers?: CompileTriggerResult | CompileTriggerResult[];
}

export interface CompileClassResult {
	bodyCrc?: number;
	column: number;
	id?: ID;
	line: number;
	name?: string;
	problem?: string;
	problems?: CompileIssue | CompileIssue[];
	success: boolean;
	warnings?: CompileIssue | CompileIssue[];
}

export interface CompileIssue {
	column?: number;
	line?: number;
	message?: string;
}

export interface DeleteApexResult {
	id?: ID;
	problem?: string;
	success: boolean;
}

export interface RunTestsResult {
	apexLogId?: string;
	codeCoverage?: CodeCoverageResult | CodeCoverageResult[];
	codeCoverageWarnings?: CodeCoverageWarning | CodeCoverageWarning[];
	failures?: RunTestFailure | RunTestFailure[];
	flowCoverage?: FlowCoverageResult | FlowCoverageResult[];
	flowCoverageWarnings?: FlowCoverageWarning | FlowCoverageWarning[];
	numFailures: number;
	numTestsRun: number;
	successes?: RunTestSuccess | RunTestSuccess[];
	totalTime: number;
}

export interface CodeCoverageResult {
	id: ID;
	locationsNotCovered?: CodeLocation | CodeLocation[];
	name: string;
	namespace?: string;
	numLocations: number;
	numLocationsNotCovered: number;
	type: string;
}

export interface CodeLocation {
	column: number;
	line: number;
	numExecutions: number;
	time: number;
}

export interface CodeCoverageWarning {
	id: ID;
	message: string;
	name?: string;
	namespace?: string;
}

export interface RunTestFailure {
	id: ID;
	message: string;
	methodName?: string;
	name: string;
	namespace?: string;
	seeAllData?: boolean;
	stackTrace?: string;
	time: number;
	type: string;
}

export interface FlowCoverageResult {
	elementsNotCovered?: string | string[];
	flowId: string;
	flowName: string;
	flowNamespace?: string;
	numElements: number;
	numElementsNotCovered: number;
	processType: FlowProcessType;
}

export interface FlowCoverageWarning {
	flowId?: string;
	flowName?: string;
	flowNamespace?: string;
	message: string;
}

export interface RunTestSuccess {
	id: ID;
	methodName: string;
	name: string;
	namespace?: string;
	seeAllData?: boolean;
	time: number;
}

export interface CompileTriggerResult {
	bodyCrc?: number;
	column: number;
	id?: ID;
	line: number;
	name?: string;
	problem?: string;
	problems?: CompileIssue | CompileIssue[];
	success: boolean;
	warnings?: CompileIssue | CompileIssue[];
}

export interface ExecuteAnonymousResult {
	column: number;
	compileProblem?: string;
	compiled: boolean;
	exceptionMessage?: string;
	exceptionStackTrace?: string;
	line: number;
	success: boolean;
}

export interface WsdlToApexInfo {
	mapping?: NamespacePackagePair | NamespacePackagePair[];
	wsdl: string;
}

export interface NamespacePackagePair {
	namespace: string;
	packageName: string;
}

export interface WsdlToApexResult {
	apexScripts?: string | string[];
	errors?: string | string[];
	success: boolean;
}

export interface LogInfo {
	category: LogCategory;
	level: LogCategoryLevel;
}

export interface PackageVersion {
	majorNumber: number;
	minorNumber: number;
	namespace: string;
}

export interface AllowFieldTruncationHeader {
	allowFieldTruncation: boolean;
}

export interface CallOptions {
	client: string;
	perfOption: PerfOption;
	uiRequestId: string;
}

export interface DebuggingHeader {
	categories?: LogInfo | LogInfo[];
	debugLevel: LogType;
}

export interface DebuggingInfo {
	debugLog: string;
}

export interface DisableFeedTrackingHeader {
	disableFeedTracking: boolean;
}

export interface PackageVersionHeader {
	packageVersions?: PackageVersion | PackageVersion[];
}

export interface SessionHeader {
	sessionId: string;
}

export interface compileAndTest {
	CompileAndTestRequest: CompileAndTestRequest;
}

export interface compileAndTestResponse {
	result: CompileAndTestResult;
}

export interface compileClasses {
	scripts?: string | string[];
}

export interface compileClassesResponse {
	result?: CompileClassResult | CompileClassResult[];
}

export interface compileTriggers {
	scripts?: string | string[];
}

export interface compileTriggersResponse {
	result?: CompileTriggerResult | CompileTriggerResult[];
}

export interface executeAnonymous {
	String: string;
}

export interface executeAnonymousResponse {
	result: ExecuteAnonymousResult;
}

export interface runTests {
	RunTestsRequest: RunTestsRequest;
}

export interface runTestsResponse {
	result: RunTestsResult;
}

export interface wsdlToApex {
	info: WsdlToApexInfo;
}

export interface wsdlToApexResponse {
	result: WsdlToApexResult;
}

