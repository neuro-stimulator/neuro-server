'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">Neuro-stimulator server documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EmptyModule.html" data-type="entity-link" >EmptyModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureAclApplicationCoreModule.html" data-type="entity-link" >StimFeatureAclApplicationCoreModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureAclApplicationModule.html" data-type="entity-link" >StimFeatureAclApplicationModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureAclDomainCoreModule.html" data-type="entity-link" >StimFeatureAclDomainCoreModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureAclDomainModule.html" data-type="entity-link" >StimFeatureAclDomainModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureAclInfrastructureCoreModule.html" data-type="entity-link" >StimFeatureAclInfrastructureCoreModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureAclInfrastructureModule.html" data-type="entity-link" >StimFeatureAclInfrastructureModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureAuthApplicationCoreModule.html" data-type="entity-link" >StimFeatureAuthApplicationCoreModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureAuthApplicationModule.html" data-type="entity-link" >StimFeatureAuthApplicationModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureAuthDomainCoreModule.html" data-type="entity-link" >StimFeatureAuthDomainCoreModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureAuthDomainModule.html" data-type="entity-link" >StimFeatureAuthDomainModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureAuthInfrastructureCoreModule.html" data-type="entity-link" >StimFeatureAuthInfrastructureCoreModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureAuthInfrastructureModule.html" data-type="entity-link" >StimFeatureAuthInfrastructureModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureExperimentResultsApplicationModule.html" data-type="entity-link" >StimFeatureExperimentResultsApplicationModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StimFeatureExperimentResultsApplicationModule-a84741e4784e2dd016acc458e1130287c47f06f3e115e0790632782d70fa2606b90ff81dd25885433e2719838578dc8d7ab07dd98c14247e316250f940c75feb"' : 'data-target="#xs-injectables-links-module-StimFeatureExperimentResultsApplicationModule-a84741e4784e2dd016acc458e1130287c47f06f3e115e0790632782d70fa2606b90ff81dd25885433e2719838578dc8d7ab07dd98c14247e316250f940c75feb"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StimFeatureExperimentResultsApplicationModule-a84741e4784e2dd016acc458e1130287c47f06f3e115e0790632782d70fa2606b90ff81dd25885433e2719838578dc8d7ab07dd98c14247e316250f940c75feb"' :
                                        'id="xs-injectables-links-module-StimFeatureExperimentResultsApplicationModule-a84741e4784e2dd016acc458e1130287c47f06f3e115e0790632782d70fa2606b90ff81dd25885433e2719838578dc8d7ab07dd98c14247e316250f940c75feb"' }>
                                        <li class="link">
                                            <a href="injectables/ExperimentResultsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExperimentResultsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureExperimentResultsDomainModule.html" data-type="entity-link" >StimFeatureExperimentResultsDomainModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StimFeatureExperimentResultsDomainModule-cc4fdb82dabbe8db1b920dd8d865d2cfdd7c3069dc8ae55417486e488019dd68afb649622920122d2403fbcd3792f87e0b3b8d604e43e16aaca46ba8c093d7fe"' : 'data-target="#xs-injectables-links-module-StimFeatureExperimentResultsDomainModule-cc4fdb82dabbe8db1b920dd8d865d2cfdd7c3069dc8ae55417486e488019dd68afb649622920122d2403fbcd3792f87e0b3b8d604e43e16aaca46ba8c093d7fe"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StimFeatureExperimentResultsDomainModule-cc4fdb82dabbe8db1b920dd8d865d2cfdd7c3069dc8ae55417486e488019dd68afb649622920122d2403fbcd3792f87e0b3b8d604e43e16aaca46ba8c093d7fe"' :
                                        'id="xs-injectables-links-module-StimFeatureExperimentResultsDomainModule-cc4fdb82dabbe8db1b920dd8d865d2cfdd7c3069dc8ae55417486e488019dd68afb649622920122d2403fbcd3792f87e0b3b8d604e43e16aaca46ba8c093d7fe"' }>
                                        <li class="link">
                                            <a href="injectables/AclActionSeeder.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclActionSeeder</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AclPossessionSeeder.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclPossessionSeeder</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AclRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AclResourceSeeder.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclResourceSeeder</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AclRoleSeeder.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclRoleSeeder</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AclSeeder.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclSeeder</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureExperimentResultsInfrastructureModule.html" data-type="entity-link" >StimFeatureExperimentResultsInfrastructureModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-StimFeatureExperimentResultsInfrastructureModule-dba78aa47fc66254902663c9d32ad2c77db86fc817837eb7040598b529395e8e4f904946181440e202ee66a9f798499a1aa5627300f56d378a17a5c912a738d2"' : 'data-target="#xs-controllers-links-module-StimFeatureExperimentResultsInfrastructureModule-dba78aa47fc66254902663c9d32ad2c77db86fc817837eb7040598b529395e8e4f904946181440e202ee66a9f798499a1aa5627300f56d378a17a5c912a738d2"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StimFeatureExperimentResultsInfrastructureModule-dba78aa47fc66254902663c9d32ad2c77db86fc817837eb7040598b529395e8e4f904946181440e202ee66a9f798499a1aa5627300f56d378a17a5c912a738d2"' :
                                            'id="xs-controllers-links-module-StimFeatureExperimentResultsInfrastructureModule-dba78aa47fc66254902663c9d32ad2c77db86fc817837eb7040598b529395e8e4f904946181440e202ee66a9f798499a1aa5627300f56d378a17a5c912a738d2"' }>
                                            <li class="link">
                                                <a href="controllers/ExperimentResultsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExperimentResultsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StimFeatureExperimentResultsInfrastructureModule-dba78aa47fc66254902663c9d32ad2c77db86fc817837eb7040598b529395e8e4f904946181440e202ee66a9f798499a1aa5627300f56d378a17a5c912a738d2"' : 'data-target="#xs-injectables-links-module-StimFeatureExperimentResultsInfrastructureModule-dba78aa47fc66254902663c9d32ad2c77db86fc817837eb7040598b529395e8e4f904946181440e202ee66a9f798499a1aa5627300f56d378a17a5c912a738d2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StimFeatureExperimentResultsInfrastructureModule-dba78aa47fc66254902663c9d32ad2c77db86fc817837eb7040598b529395e8e4f904946181440e202ee66a9f798499a1aa5627300f56d378a17a5c912a738d2"' :
                                        'id="xs-injectables-links-module-StimFeatureExperimentResultsInfrastructureModule-dba78aa47fc66254902663c9d32ad2c77db86fc817837eb7040598b529395e8e4f904946181440e202ee66a9f798499a1aa5627300f56d378a17a5c912a738d2"' }>
                                        <li class="link">
                                            <a href="injectables/ExperimentResultsFacade.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExperimentResultsFacade</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureExperimentsApplicationModule.html" data-type="entity-link" >StimFeatureExperimentsApplicationModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StimFeatureExperimentsApplicationModule-bb5444957728ce78b68b96533b08555cea1f0ba56e344d2a68b2a2f00a9aea1b9402330d8f7513f89593f039fe8869a258dbe9db344d1751731458268293020e"' : 'data-target="#xs-injectables-links-module-StimFeatureExperimentsApplicationModule-bb5444957728ce78b68b96533b08555cea1f0ba56e344d2a68b2a2f00a9aea1b9402330d8f7513f89593f039fe8869a258dbe9db344d1751731458268293020e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StimFeatureExperimentsApplicationModule-bb5444957728ce78b68b96533b08555cea1f0ba56e344d2a68b2a2f00a9aea1b9402330d8f7513f89593f039fe8869a258dbe9db344d1751731458268293020e"' :
                                        'id="xs-injectables-links-module-StimFeatureExperimentsApplicationModule-bb5444957728ce78b68b96533b08555cea1f0ba56e344d2a68b2a2f00a9aea1b9402330d8f7513f89593f039fe8869a258dbe9db344d1751731458268293020e"' }>
                                        <li class="link">
                                            <a href="injectables/ExperimentsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExperimentsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureExperimentsDomainModule.html" data-type="entity-link" >StimFeatureExperimentsDomainModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StimFeatureExperimentsDomainModule-122f5839f26363306e9064d43a4f690d16bc19858579ff07ce7e740e95c59a6ce12261221aeb9b0bf25afa69abcbdba8715bcf7e4ef96795dc745731bf22709c"' : 'data-target="#xs-injectables-links-module-StimFeatureExperimentsDomainModule-122f5839f26363306e9064d43a4f690d16bc19858579ff07ce7e740e95c59a6ce12261221aeb9b0bf25afa69abcbdba8715bcf7e4ef96795dc745731bf22709c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StimFeatureExperimentsDomainModule-122f5839f26363306e9064d43a4f690d16bc19858579ff07ce7e740e95c59a6ce12261221aeb9b0bf25afa69abcbdba8715bcf7e4ef96795dc745731bf22709c"' :
                                        'id="xs-injectables-links-module-StimFeatureExperimentsDomainModule-122f5839f26363306e9064d43a4f690d16bc19858579ff07ce7e740e95c59a6ce12261221aeb9b0bf25afa69abcbdba8715bcf7e4ef96795dc745731bf22709c"' }>
                                        <li class="link">
                                            <a href="injectables/AclActionSeeder.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclActionSeeder</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AclPossessionSeeder.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclPossessionSeeder</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AclRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AclResourceSeeder.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclResourceSeeder</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AclRoleSeeder.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclRoleSeeder</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AclSeeder.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclSeeder</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureExperimentsInfrastructureModule.html" data-type="entity-link" >StimFeatureExperimentsInfrastructureModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-StimFeatureExperimentsInfrastructureModule-aa3cb62be0c89b2ba0574fc844e5acd8f08ea574caf6264ce031a32ff13913609320806c92bebe5757bd31e644eea0d2476615dfed1100524156394fdd33c3e4"' : 'data-target="#xs-controllers-links-module-StimFeatureExperimentsInfrastructureModule-aa3cb62be0c89b2ba0574fc844e5acd8f08ea574caf6264ce031a32ff13913609320806c92bebe5757bd31e644eea0d2476615dfed1100524156394fdd33c3e4"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StimFeatureExperimentsInfrastructureModule-aa3cb62be0c89b2ba0574fc844e5acd8f08ea574caf6264ce031a32ff13913609320806c92bebe5757bd31e644eea0d2476615dfed1100524156394fdd33c3e4"' :
                                            'id="xs-controllers-links-module-StimFeatureExperimentsInfrastructureModule-aa3cb62be0c89b2ba0574fc844e5acd8f08ea574caf6264ce031a32ff13913609320806c92bebe5757bd31e644eea0d2476615dfed1100524156394fdd33c3e4"' }>
                                            <li class="link">
                                                <a href="controllers/ExperimentsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExperimentsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StimFeatureExperimentsInfrastructureModule-aa3cb62be0c89b2ba0574fc844e5acd8f08ea574caf6264ce031a32ff13913609320806c92bebe5757bd31e644eea0d2476615dfed1100524156394fdd33c3e4"' : 'data-target="#xs-injectables-links-module-StimFeatureExperimentsInfrastructureModule-aa3cb62be0c89b2ba0574fc844e5acd8f08ea574caf6264ce031a32ff13913609320806c92bebe5757bd31e644eea0d2476615dfed1100524156394fdd33c3e4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StimFeatureExperimentsInfrastructureModule-aa3cb62be0c89b2ba0574fc844e5acd8f08ea574caf6264ce031a32ff13913609320806c92bebe5757bd31e644eea0d2476615dfed1100524156394fdd33c3e4"' :
                                        'id="xs-injectables-links-module-StimFeatureExperimentsInfrastructureModule-aa3cb62be0c89b2ba0574fc844e5acd8f08ea574caf6264ce031a32ff13913609320806c92bebe5757bd31e644eea0d2476615dfed1100524156394fdd33c3e4"' }>
                                        <li class="link">
                                            <a href="injectables/ExperimentsFacade.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExperimentsFacade</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureFileBrowserApplicationCoreModule.html" data-type="entity-link" >StimFeatureFileBrowserApplicationCoreModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureFileBrowserApplicationModule.html" data-type="entity-link" >StimFeatureFileBrowserApplicationModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureFileBrowserDomainCoreModule.html" data-type="entity-link" >StimFeatureFileBrowserDomainCoreModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureFileBrowserDomainModule.html" data-type="entity-link" >StimFeatureFileBrowserDomainModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureFileBrowserInfrastructureCoreModule.html" data-type="entity-link" >StimFeatureFileBrowserInfrastructureCoreModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureFileBrowserInfrastructureModule.html" data-type="entity-link" >StimFeatureFileBrowserInfrastructureModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureIpcApplicationCoreModule.html" data-type="entity-link" >StimFeatureIpcApplicationCoreModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureIpcApplicationModule.html" data-type="entity-link" >StimFeatureIpcApplicationModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureIpcDomainCoreModule.html" data-type="entity-link" >StimFeatureIpcDomainCoreModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureIpcDomainModule.html" data-type="entity-link" >StimFeatureIpcDomainModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureIpcInfrastructureCoreModule.html" data-type="entity-link" >StimFeatureIpcInfrastructureCoreModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureIpcInfrastructureModule.html" data-type="entity-link" >StimFeatureIpcInfrastructureModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeaturePlayerApplicationModule.html" data-type="entity-link" >StimFeaturePlayerApplicationModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StimFeaturePlayerApplicationModule-e49dfbfbd4c05c613b25a3079c4286fbed7e2b11ff8a2b44df9a677f0b1978f78a048bc18fbc89ccbd48d6482583a854219db684ed04675556b15a09e69169e8"' : 'data-target="#xs-injectables-links-module-StimFeaturePlayerApplicationModule-e49dfbfbd4c05c613b25a3079c4286fbed7e2b11ff8a2b44df9a677f0b1978f78a048bc18fbc89ccbd48d6482583a854219db684ed04675556b15a09e69169e8"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StimFeaturePlayerApplicationModule-e49dfbfbd4c05c613b25a3079c4286fbed7e2b11ff8a2b44df9a677f0b1978f78a048bc18fbc89ccbd48d6482583a854219db684ed04675556b15a09e69169e8"' :
                                        'id="xs-injectables-links-module-StimFeaturePlayerApplicationModule-e49dfbfbd4c05c613b25a3079c4286fbed7e2b11ff8a2b44df9a677f0b1978f78a048bc18fbc89ccbd48d6482583a854219db684ed04675556b15a09e69169e8"' }>
                                        <li class="link">
                                            <a href="injectables/PlayerService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PlayerService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StopConditionsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StopConditionsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeaturePlayerDomainModule.html" data-type="entity-link" >StimFeaturePlayerDomainModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StimFeaturePlayerDomainModule-ddc1f527a386e7591d17a66a6a5a75535cd986e11a3fb8e428be0f7a60baf297e72e19bdf33f6107b1e6bb3c7df3586ba08db2c5eb25804ca07f6c801a355cd0"' : 'data-target="#xs-injectables-links-module-StimFeaturePlayerDomainModule-ddc1f527a386e7591d17a66a6a5a75535cd986e11a3fb8e428be0f7a60baf297e72e19bdf33f6107b1e6bb3c7df3586ba08db2c5eb25804ca07f6c801a355cd0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StimFeaturePlayerDomainModule-ddc1f527a386e7591d17a66a6a5a75535cd986e11a3fb8e428be0f7a60baf297e72e19bdf33f6107b1e6bb3c7df3586ba08db2c5eb25804ca07f6c801a355cd0"' :
                                        'id="xs-injectables-links-module-StimFeaturePlayerDomainModule-ddc1f527a386e7591d17a66a6a5a75535cd986e11a3fb8e428be0f7a60baf297e72e19bdf33f6107b1e6bb3c7df3586ba08db2c5eb25804ca07f6c801a355cd0"' }>
                                        <li class="link">
                                            <a href="injectables/AclActionSeeder.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclActionSeeder</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AclPossessionSeeder.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclPossessionSeeder</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AclRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AclResourceSeeder.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclResourceSeeder</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AclRoleSeeder.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclRoleSeeder</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AclSeeder.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclSeeder</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ExperimentStopConditionFactory.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ExperimentStopConditionFactory</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeaturePlayerInfrastructureModule.html" data-type="entity-link" >StimFeaturePlayerInfrastructureModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-StimFeaturePlayerInfrastructureModule-11814540e0cb085d3cc734a8c565c77016a806d887aa29021370279ec96ad059f399870279a563c719067a4e9b0b501d46573f4fcdac5e283e99d99cc8b1ff90"' : 'data-target="#xs-controllers-links-module-StimFeaturePlayerInfrastructureModule-11814540e0cb085d3cc734a8c565c77016a806d887aa29021370279ec96ad059f399870279a563c719067a4e9b0b501d46573f4fcdac5e283e99d99cc8b1ff90"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StimFeaturePlayerInfrastructureModule-11814540e0cb085d3cc734a8c565c77016a806d887aa29021370279ec96ad059f399870279a563c719067a4e9b0b501d46573f4fcdac5e283e99d99cc8b1ff90"' :
                                            'id="xs-controllers-links-module-StimFeaturePlayerInfrastructureModule-11814540e0cb085d3cc734a8c565c77016a806d887aa29021370279ec96ad059f399870279a563c719067a4e9b0b501d46573f4fcdac5e283e99d99cc8b1ff90"' }>
                                            <li class="link">
                                                <a href="controllers/PlayerController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PlayerController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StimFeaturePlayerInfrastructureModule-11814540e0cb085d3cc734a8c565c77016a806d887aa29021370279ec96ad059f399870279a563c719067a4e9b0b501d46573f4fcdac5e283e99d99cc8b1ff90"' : 'data-target="#xs-injectables-links-module-StimFeaturePlayerInfrastructureModule-11814540e0cb085d3cc734a8c565c77016a806d887aa29021370279ec96ad059f399870279a563c719067a4e9b0b501d46573f4fcdac5e283e99d99cc8b1ff90"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StimFeaturePlayerInfrastructureModule-11814540e0cb085d3cc734a8c565c77016a806d887aa29021370279ec96ad059f399870279a563c719067a4e9b0b501d46573f4fcdac5e283e99d99cc8b1ff90"' :
                                        'id="xs-injectables-links-module-StimFeaturePlayerInfrastructureModule-11814540e0cb085d3cc734a8c565c77016a806d887aa29021370279ec96ad059f399870279a563c719067a4e9b0b501d46573f4fcdac5e283e99d99cc8b1ff90"' }>
                                        <li class="link">
                                            <a href="injectables/PlayerFacade.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PlayerFacade</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureSeedApplicationModule.html" data-type="entity-link" >StimFeatureSeedApplicationModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StimFeatureSeedApplicationModule-05bc7eacd41194a36eb0432b1d44e4dc6337d7556b634debd20eae579c13fd95ad4364a794cd4d31c4574fef37eca429e76c1a4e5feeebcdfbaa1c47e90ef77c"' : 'data-target="#xs-injectables-links-module-StimFeatureSeedApplicationModule-05bc7eacd41194a36eb0432b1d44e4dc6337d7556b634debd20eae579c13fd95ad4364a794cd4d31c4574fef37eca429e76c1a4e5feeebcdfbaa1c47e90ef77c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StimFeatureSeedApplicationModule-05bc7eacd41194a36eb0432b1d44e4dc6337d7556b634debd20eae579c13fd95ad4364a794cd4d31c4574fef37eca429e76c1a4e5feeebcdfbaa1c47e90ef77c"' :
                                        'id="xs-injectables-links-module-StimFeatureSeedApplicationModule-05bc7eacd41194a36eb0432b1d44e4dc6337d7556b634debd20eae579c13fd95ad4364a794cd4d31c4574fef37eca429e76c1a4e5feeebcdfbaa1c47e90ef77c"' }>
                                        <li class="link">
                                            <a href="injectables/DatabaseDumpService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DatabaseDumpService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EntityTransformerExplorerService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EntityTransformerExplorerService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SeedExplorerService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeedExplorerService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SeederServiceProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeederServiceProvider</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureSeedDomainModule.html" data-type="entity-link" >StimFeatureSeedDomainModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureSeedInfrastructureModule.html" data-type="entity-link" >StimFeatureSeedInfrastructureModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-StimFeatureSeedInfrastructureModule-f3dfc83a9a1053e179a54b328af9156927fbbf888d8f4c8e29bc1c59fcce974b9785397a872afa60dd31db3b90b5522c9fc5958e29d042530e348b4a61c4b9b8"' : 'data-target="#xs-controllers-links-module-StimFeatureSeedInfrastructureModule-f3dfc83a9a1053e179a54b328af9156927fbbf888d8f4c8e29bc1c59fcce974b9785397a872afa60dd31db3b90b5522c9fc5958e29d042530e348b4a61c4b9b8"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StimFeatureSeedInfrastructureModule-f3dfc83a9a1053e179a54b328af9156927fbbf888d8f4c8e29bc1c59fcce974b9785397a872afa60dd31db3b90b5522c9fc5958e29d042530e348b4a61c4b9b8"' :
                                            'id="xs-controllers-links-module-StimFeatureSeedInfrastructureModule-f3dfc83a9a1053e179a54b328af9156927fbbf888d8f4c8e29bc1c59fcce974b9785397a872afa60dd31db3b90b5522c9fc5958e29d042530e348b4a61c4b9b8"' }>
                                            <li class="link">
                                                <a href="controllers/SeedController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeedController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StimFeatureSeedInfrastructureModule-f3dfc83a9a1053e179a54b328af9156927fbbf888d8f4c8e29bc1c59fcce974b9785397a872afa60dd31db3b90b5522c9fc5958e29d042530e348b4a61c4b9b8"' : 'data-target="#xs-injectables-links-module-StimFeatureSeedInfrastructureModule-f3dfc83a9a1053e179a54b328af9156927fbbf888d8f4c8e29bc1c59fcce974b9785397a872afa60dd31db3b90b5522c9fc5958e29d042530e348b4a61c4b9b8"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StimFeatureSeedInfrastructureModule-f3dfc83a9a1053e179a54b328af9156927fbbf888d8f4c8e29bc1c59fcce974b9785397a872afa60dd31db3b90b5522c9fc5958e29d042530e348b4a61c4b9b8"' :
                                        'id="xs-injectables-links-module-StimFeatureSeedInfrastructureModule-f3dfc83a9a1053e179a54b328af9156927fbbf888d8f4c8e29bc1c59fcce974b9785397a872afa60dd31db3b90b5522c9fc5958e29d042530e348b4a61c4b9b8"' }>
                                        <li class="link">
                                            <a href="injectables/SeedFacade.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SeedFacade</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureSequencesApplicationModule.html" data-type="entity-link" >StimFeatureSequencesApplicationModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StimFeatureSequencesApplicationModule-c5ac2f2182d15fb115d713f78a48b328e107906f9b79f6534ad09500a393f3ecb61c9727ffd0ca0c527587a0f62afe1f16e628b4e4952c0b2572260013367884"' : 'data-target="#xs-injectables-links-module-StimFeatureSequencesApplicationModule-c5ac2f2182d15fb115d713f78a48b328e107906f9b79f6534ad09500a393f3ecb61c9727ffd0ca0c527587a0f62afe1f16e628b4e4952c0b2572260013367884"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StimFeatureSequencesApplicationModule-c5ac2f2182d15fb115d713f78a48b328e107906f9b79f6534ad09500a393f3ecb61c9727ffd0ca0c527587a0f62afe1f16e628b4e4952c0b2572260013367884"' :
                                        'id="xs-injectables-links-module-StimFeatureSequencesApplicationModule-c5ac2f2182d15fb115d713f78a48b328e107906f9b79f6534ad09500a393f3ecb61c9727ffd0ca0c527587a0f62afe1f16e628b4e4952c0b2572260013367884"' }>
                                        <li class="link">
                                            <a href="injectables/SequencesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SequencesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureSequencesDomainModule.html" data-type="entity-link" >StimFeatureSequencesDomainModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StimFeatureSequencesDomainModule-6a35fc02a0771aefb115fa63476b8ea8b62f043931956ebfb6fb96112d8f567758b6cc8f2154706e938b725d7bd706bbaef70ddf851126edc346ce79d33e260f"' : 'data-target="#xs-injectables-links-module-StimFeatureSequencesDomainModule-6a35fc02a0771aefb115fa63476b8ea8b62f043931956ebfb6fb96112d8f567758b6cc8f2154706e938b725d7bd706bbaef70ddf851126edc346ce79d33e260f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StimFeatureSequencesDomainModule-6a35fc02a0771aefb115fa63476b8ea8b62f043931956ebfb6fb96112d8f567758b6cc8f2154706e938b725d7bd706bbaef70ddf851126edc346ce79d33e260f"' :
                                        'id="xs-injectables-links-module-StimFeatureSequencesDomainModule-6a35fc02a0771aefb115fa63476b8ea8b62f043931956ebfb6fb96112d8f567758b6cc8f2154706e938b725d7bd706bbaef70ddf851126edc346ce79d33e260f"' }>
                                        <li class="link">
                                            <a href="injectables/AclActionSeeder.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclActionSeeder</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AclPossessionSeeder.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclPossessionSeeder</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AclRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AclResourceSeeder.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclResourceSeeder</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AclRoleSeeder.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclRoleSeeder</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AclSeeder.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclSeeder</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureSequencesInfrastructureModule.html" data-type="entity-link" >StimFeatureSequencesInfrastructureModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-StimFeatureSequencesInfrastructureModule-393023250b9467d5dede2b663f00a773507b3df4b6276e627d9b8807a05f8bdc7ae12e239b2c00fe5012bdb1d491f8ecfc61655083500de4113fa63563fc251c"' : 'data-target="#xs-controllers-links-module-StimFeatureSequencesInfrastructureModule-393023250b9467d5dede2b663f00a773507b3df4b6276e627d9b8807a05f8bdc7ae12e239b2c00fe5012bdb1d491f8ecfc61655083500de4113fa63563fc251c"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StimFeatureSequencesInfrastructureModule-393023250b9467d5dede2b663f00a773507b3df4b6276e627d9b8807a05f8bdc7ae12e239b2c00fe5012bdb1d491f8ecfc61655083500de4113fa63563fc251c"' :
                                            'id="xs-controllers-links-module-StimFeatureSequencesInfrastructureModule-393023250b9467d5dede2b663f00a773507b3df4b6276e627d9b8807a05f8bdc7ae12e239b2c00fe5012bdb1d491f8ecfc61655083500de4113fa63563fc251c"' }>
                                            <li class="link">
                                                <a href="controllers/SequencesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SequencesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StimFeatureSequencesInfrastructureModule-393023250b9467d5dede2b663f00a773507b3df4b6276e627d9b8807a05f8bdc7ae12e239b2c00fe5012bdb1d491f8ecfc61655083500de4113fa63563fc251c"' : 'data-target="#xs-injectables-links-module-StimFeatureSequencesInfrastructureModule-393023250b9467d5dede2b663f00a773507b3df4b6276e627d9b8807a05f8bdc7ae12e239b2c00fe5012bdb1d491f8ecfc61655083500de4113fa63563fc251c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StimFeatureSequencesInfrastructureModule-393023250b9467d5dede2b663f00a773507b3df4b6276e627d9b8807a05f8bdc7ae12e239b2c00fe5012bdb1d491f8ecfc61655083500de4113fa63563fc251c"' :
                                        'id="xs-injectables-links-module-StimFeatureSequencesInfrastructureModule-393023250b9467d5dede2b663f00a773507b3df4b6276e627d9b8807a05f8bdc7ae12e239b2c00fe5012bdb1d491f8ecfc61655083500de4113fa63563fc251c"' }>
                                        <li class="link">
                                            <a href="injectables/SequencesFacade.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SequencesFacade</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureSettingsCoreModule.html" data-type="entity-link" >StimFeatureSettingsCoreModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureSettingsModule.html" data-type="entity-link" >StimFeatureSettingsModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureStimulatorApplicationCoreModule.html" data-type="entity-link" >StimFeatureStimulatorApplicationCoreModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureStimulatorApplicationModule.html" data-type="entity-link" >StimFeatureStimulatorApplicationModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureStimulatorDomainCoreModule.html" data-type="entity-link" >StimFeatureStimulatorDomainCoreModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureStimulatorDomainModule.html" data-type="entity-link" >StimFeatureStimulatorDomainModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureStimulatorInfrastructureCoreModule.html" data-type="entity-link" >StimFeatureStimulatorInfrastructureCoreModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureStimulatorInfrastructureModule.html" data-type="entity-link" >StimFeatureStimulatorInfrastructureModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureTriggersApplicationModule.html" data-type="entity-link" >StimFeatureTriggersApplicationModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StimFeatureTriggersApplicationModule-0a09c2d437649764301f5f27c0b08184c1f97b95c7e3815f01d19471bcc25e01d439a0c723fc58bea539a4a8fb3576d9c4eb133956bb9f212cef52711d795785"' : 'data-target="#xs-injectables-links-module-StimFeatureTriggersApplicationModule-0a09c2d437649764301f5f27c0b08184c1f97b95c7e3815f01d19471bcc25e01d439a0c723fc58bea539a4a8fb3576d9c4eb133956bb9f212cef52711d795785"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StimFeatureTriggersApplicationModule-0a09c2d437649764301f5f27c0b08184c1f97b95c7e3815f01d19471bcc25e01d439a0c723fc58bea539a4a8fb3576d9c4eb133956bb9f212cef52711d795785"' :
                                        'id="xs-injectables-links-module-StimFeatureTriggersApplicationModule-0a09c2d437649764301f5f27c0b08184c1f97b95c7e3815f01d19471bcc25e01d439a0c723fc58bea539a4a8fb3576d9c4eb133956bb9f212cef52711d795785"' }>
                                        <li class="link">
                                            <a href="injectables/TriggersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TriggersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureTriggersDomainModule.html" data-type="entity-link" >StimFeatureTriggersDomainModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StimFeatureTriggersDomainModule-c66be481740eb18d8a2a67ea52d1dca277c7f2ca37d90059c1f298b40ddc0322f084693b21fa0cfbdcd1bf5db6dc562df4bdc679164b62d6245f6fcfcea31edc"' : 'data-target="#xs-injectables-links-module-StimFeatureTriggersDomainModule-c66be481740eb18d8a2a67ea52d1dca277c7f2ca37d90059c1f298b40ddc0322f084693b21fa0cfbdcd1bf5db6dc562df4bdc679164b62d6245f6fcfcea31edc"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StimFeatureTriggersDomainModule-c66be481740eb18d8a2a67ea52d1dca277c7f2ca37d90059c1f298b40ddc0322f084693b21fa0cfbdcd1bf5db6dc562df4bdc679164b62d6245f6fcfcea31edc"' :
                                        'id="xs-injectables-links-module-StimFeatureTriggersDomainModule-c66be481740eb18d8a2a67ea52d1dca277c7f2ca37d90059c1f298b40ddc0322f084693b21fa0cfbdcd1bf5db6dc562df4bdc679164b62d6245f6fcfcea31edc"' }>
                                        <li class="link">
                                            <a href="injectables/AclRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclRepository</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureTriggersInfrastructureModule.html" data-type="entity-link" >StimFeatureTriggersInfrastructureModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-StimFeatureTriggersInfrastructureModule-0ceb4d886ec5eee21a1efc791d9441b52dbe8016747d61f8da5e5cc36b6eb778696a67e34cc1ed366c1e8efd03eeab042f594acab8f4ed107894db41a92db2b0"' : 'data-target="#xs-controllers-links-module-StimFeatureTriggersInfrastructureModule-0ceb4d886ec5eee21a1efc791d9441b52dbe8016747d61f8da5e5cc36b6eb778696a67e34cc1ed366c1e8efd03eeab042f594acab8f4ed107894db41a92db2b0"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StimFeatureTriggersInfrastructureModule-0ceb4d886ec5eee21a1efc791d9441b52dbe8016747d61f8da5e5cc36b6eb778696a67e34cc1ed366c1e8efd03eeab042f594acab8f4ed107894db41a92db2b0"' :
                                            'id="xs-controllers-links-module-StimFeatureTriggersInfrastructureModule-0ceb4d886ec5eee21a1efc791d9441b52dbe8016747d61f8da5e5cc36b6eb778696a67e34cc1ed366c1e8efd03eeab042f594acab8f4ed107894db41a92db2b0"' }>
                                            <li class="link">
                                                <a href="controllers/StimFeatureTriggersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StimFeatureTriggersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StimFeatureTriggersInfrastructureModule-0ceb4d886ec5eee21a1efc791d9441b52dbe8016747d61f8da5e5cc36b6eb778696a67e34cc1ed366c1e8efd03eeab042f594acab8f4ed107894db41a92db2b0"' : 'data-target="#xs-injectables-links-module-StimFeatureTriggersInfrastructureModule-0ceb4d886ec5eee21a1efc791d9441b52dbe8016747d61f8da5e5cc36b6eb778696a67e34cc1ed366c1e8efd03eeab042f594acab8f4ed107894db41a92db2b0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StimFeatureTriggersInfrastructureModule-0ceb4d886ec5eee21a1efc791d9441b52dbe8016747d61f8da5e5cc36b6eb778696a67e34cc1ed366c1e8efd03eeab042f594acab8f4ed107894db41a92db2b0"' :
                                        'id="xs-injectables-links-module-StimFeatureTriggersInfrastructureModule-0ceb4d886ec5eee21a1efc791d9441b52dbe8016747d61f8da5e5cc36b6eb778696a67e34cc1ed366c1e8efd03eeab042f594acab8f4ed107894db41a92db2b0"' }>
                                        <li class="link">
                                            <a href="injectables/StimFeatureTriggersFacade.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StimFeatureTriggersFacade</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureUsersApplicationModule.html" data-type="entity-link" >StimFeatureUsersApplicationModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StimFeatureUsersApplicationModule-74f53933aabd4595a55b014ac41ae7a73bda658a22eadf921d3d1eaf38408108cd8a386e3b9cabca58b8ed617bfa8f4fa8a459c38b43570e07340ccbbc165df8"' : 'data-target="#xs-injectables-links-module-StimFeatureUsersApplicationModule-74f53933aabd4595a55b014ac41ae7a73bda658a22eadf921d3d1eaf38408108cd8a386e3b9cabca58b8ed617bfa8f4fa8a459c38b43570e07340ccbbc165df8"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StimFeatureUsersApplicationModule-74f53933aabd4595a55b014ac41ae7a73bda658a22eadf921d3d1eaf38408108cd8a386e3b9cabca58b8ed617bfa8f4fa8a459c38b43570e07340ccbbc165df8"' :
                                        'id="xs-injectables-links-module-StimFeatureUsersApplicationModule-74f53933aabd4595a55b014ac41ae7a73bda658a22eadf921d3d1eaf38408108cd8a386e3b9cabca58b8ed617bfa8f4fa8a459c38b43570e07340ccbbc165df8"' }>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureUsersDomainModule.html" data-type="entity-link" >StimFeatureUsersDomainModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StimFeatureUsersDomainModule-a4a74ac59fa9af6ee780eb63b822f546d491aa8ec6d7b21e40c8bfa509aa2e141959cc0cd9ee530c71c9e9f8ee9bb172a68ea4a4fbcc0e18cc8e06f0b6470d73"' : 'data-target="#xs-injectables-links-module-StimFeatureUsersDomainModule-a4a74ac59fa9af6ee780eb63b822f546d491aa8ec6d7b21e40c8bfa509aa2e141959cc0cd9ee530c71c9e9f8ee9bb172a68ea4a4fbcc0e18cc8e06f0b6470d73"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StimFeatureUsersDomainModule-a4a74ac59fa9af6ee780eb63b822f546d491aa8ec6d7b21e40c8bfa509aa2e141959cc0cd9ee530c71c9e9f8ee9bb172a68ea4a4fbcc0e18cc8e06f0b6470d73"' :
                                        'id="xs-injectables-links-module-StimFeatureUsersDomainModule-a4a74ac59fa9af6ee780eb63b822f546d491aa8ec6d7b21e40c8bfa509aa2e141959cc0cd9ee530c71c9e9f8ee9bb172a68ea4a4fbcc0e18cc8e06f0b6470d73"' }>
                                        <li class="link">
                                            <a href="injectables/AclActionSeeder.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclActionSeeder</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AclPossessionSeeder.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclPossessionSeeder</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AclRepository.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclRepository</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AclResourceSeeder.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclResourceSeeder</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AclRoleSeeder.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclRoleSeeder</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AclSeeder.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AclSeeder</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StimFeatureUsersInfrastructureModule.html" data-type="entity-link" >StimFeatureUsersInfrastructureModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-StimFeatureUsersInfrastructureModule-22d21193a56c964ac428206277a65f665152dada1d787f99342c42ae2b30c614374f9f1dc5dd43475745df4c01b8fd4c234fbee7e5e204a8819300d1a14b23e7"' : 'data-target="#xs-controllers-links-module-StimFeatureUsersInfrastructureModule-22d21193a56c964ac428206277a65f665152dada1d787f99342c42ae2b30c614374f9f1dc5dd43475745df4c01b8fd4c234fbee7e5e204a8819300d1a14b23e7"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-StimFeatureUsersInfrastructureModule-22d21193a56c964ac428206277a65f665152dada1d787f99342c42ae2b30c614374f9f1dc5dd43475745df4c01b8fd4c234fbee7e5e204a8819300d1a14b23e7"' :
                                            'id="xs-controllers-links-module-StimFeatureUsersInfrastructureModule-22d21193a56c964ac428206277a65f665152dada1d787f99342c42ae2b30c614374f9f1dc5dd43475745df4c01b8fd4c234fbee7e5e204a8819300d1a14b23e7"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StimFeatureUsersInfrastructureModule-22d21193a56c964ac428206277a65f665152dada1d787f99342c42ae2b30c614374f9f1dc5dd43475745df4c01b8fd4c234fbee7e5e204a8819300d1a14b23e7"' : 'data-target="#xs-injectables-links-module-StimFeatureUsersInfrastructureModule-22d21193a56c964ac428206277a65f665152dada1d787f99342c42ae2b30c614374f9f1dc5dd43475745df4c01b8fd4c234fbee7e5e204a8819300d1a14b23e7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StimFeatureUsersInfrastructureModule-22d21193a56c964ac428206277a65f665152dada1d787f99342c42ae2b30c614374f9f1dc5dd43475745df4c01b8fd4c234fbee7e5e204a8819300d1a14b23e7"' :
                                        'id="xs-injectables-links-module-StimFeatureUsersInfrastructureModule-22d21193a56c964ac428206277a65f665152dada1d787f99342c42ae2b30c614374f9f1dc5dd43475745df4c01b8fd4c234fbee7e5e204a8819300d1a14b23e7"' }>
                                        <li class="link">
                                            <a href="injectables/UsersFacade.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersFacade</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StimLibConnectionApplicationModule.html" data-type="entity-link" >StimLibConnectionApplicationModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimLibConnectionDomainModule.html" data-type="entity-link" >StimLibConnectionDomainModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimLibConnectionInfrastructureModule.html" data-type="entity-link" >StimLibConnectionInfrastructureModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StimLibSocketModule.html" data-type="entity-link" >StimLibSocketModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StimLibSocketModule-72236df84e60c629d2bc9175bf6d11d853b54e83a68e5a3dd51098c8e6fd572b84f17834839bde34c614b97704c20776eb10312e3888ba578c7e3842b0ae2f11"' : 'data-target="#xs-injectables-links-module-StimLibSocketModule-72236df84e60c629d2bc9175bf6d11d853b54e83a68e5a3dd51098c8e6fd572b84f17834839bde34c614b97704c20776eb10312e3888ba578c7e3842b0ae2f11"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StimLibSocketModule-72236df84e60c629d2bc9175bf6d11d853b54e83a68e5a3dd51098c8e6fd572b84f17834839bde34c614b97704c20776eb10312e3888ba578c7e3842b0ae2f11"' :
                                        'id="xs-injectables-links-module-StimLibSocketModule-72236df84e60c629d2bc9175bf6d11d853b54e83a68e5a3dd51098c8e6fd572b84f17834839bde34c614b97704c20776eb10312e3888ba578c7e3842b0ae2f11"' }>
                                        <li class="link">
                                            <a href="injectables/SocketFacade.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SocketFacade</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#controllers-links"' :
                                'data-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AclActionsController.html" data-type="entity-link" >AclActionsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AclController.html" data-type="entity-link" >AclController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AclPossessionsController.html" data-type="entity-link" >AclPossessionsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AclResourcesController.html" data-type="entity-link" >AclResourcesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AclRolesController.html" data-type="entity-link" >AclRolesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/FileBrowserController.html" data-type="entity-link" >FileBrowserController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/IpcController.html" data-type="entity-link" >IpcController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/SerialController.html" data-type="entity-link" >SerialController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/SettingsController.html" data-type="entity-link" >SettingsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/StimulatorController.html" data-type="entity-link" >StimulatorController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#entities-links"' :
                                'data-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/AclActionEntity.html" data-type="entity-link" >AclActionEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/AclEntity.html" data-type="entity-link" >AclEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/AclPossessionEntity.html" data-type="entity-link" >AclPossessionEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/AclResourceEntity.html" data-type="entity-link" >AclResourceEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/AclRoleEntity.html" data-type="entity-link" >AclRoleEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ExperimentCvepEntity.html" data-type="entity-link" >ExperimentCvepEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ExperimentCvepOutputEntity.html" data-type="entity-link" >ExperimentCvepOutputEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ExperimentEntity.html" data-type="entity-link" >ExperimentEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ExperimentErpEntity.html" data-type="entity-link" >ExperimentErpEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ExperimentErpOutputDependencyEntity.html" data-type="entity-link" >ExperimentErpOutputDependencyEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ExperimentErpOutputEntity.html" data-type="entity-link" >ExperimentErpOutputEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ExperimentFvepEntity.html" data-type="entity-link" >ExperimentFvepEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ExperimentFvepOutputEntity.html" data-type="entity-link" >ExperimentFvepOutputEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ExperimentReaEntity.html" data-type="entity-link" >ExperimentReaEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ExperimentReaOutputEntity.html" data-type="entity-link" >ExperimentReaOutputEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ExperimentResultEntity.html" data-type="entity-link" >ExperimentResultEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ExperimentStopConditionEntity.html" data-type="entity-link" >ExperimentStopConditionEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ExperimentTvepEntity.html" data-type="entity-link" >ExperimentTvepEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ExperimentTvepOutputEntity.html" data-type="entity-link" >ExperimentTvepOutputEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/GroupEntity.html" data-type="entity-link" >GroupEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/RefreshTokenEntity.html" data-type="entity-link" >RefreshTokenEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/SequenceEntity.html" data-type="entity-link" >SequenceEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/TriggerControlEntity.html" data-type="entity-link" >TriggerControlEntity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/UserEntity.html" data-type="entity-link" >UserEntity</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AbstractModuleOptionsFactory.html" data-type="entity-link" >AbstractModuleOptionsFactory</a>
                            </li>
                            <li class="link">
                                <a href="classes/AclApplicationReadyHandler.html" data-type="entity-link" >AclApplicationReadyHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/AclDeleteCommand.html" data-type="entity-link" >AclDeleteCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/AclIdNotFoundException.html" data-type="entity-link" >AclIdNotFoundException</a>
                            </li>
                            <li class="link">
                                <a href="classes/AclInsertCommand.html" data-type="entity-link" >AclInsertCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/AclInsertHandler.html" data-type="entity-link" >AclInsertHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/AclModuleConfigFactoryImpl.html" data-type="entity-link" >AclModuleConfigFactoryImpl</a>
                            </li>
                            <li class="link">
                                <a href="classes/AclNotCreatedException.html" data-type="entity-link" >AclNotCreatedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/AclNotDeletedException.html" data-type="entity-link" >AclNotDeletedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/AclNotUpdatedException.html" data-type="entity-link" >AclNotUpdatedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/AclReloadCommand.html" data-type="entity-link" >AclReloadCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/AclReloadHandler.html" data-type="entity-link" >AclReloadHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/AclSeedRepositoryHandler.html" data-type="entity-link" >AclSeedRepositoryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/AclUpdateCommand.html" data-type="entity-link" >AclUpdateCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/AclWasCreatedEvent.html" data-type="entity-link" >AclWasCreatedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AclWasDeletedEvent.html" data-type="entity-link" >AclWasDeletedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AclWasUpdatedEvent.html" data-type="entity-link" >AclWasUpdatedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AnotherExperimentResultIsInitializedException.html" data-type="entity-link" >AnotherExperimentResultIsInitializedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppendExperimentResultDataCommand.html" data-type="entity-link" >AppendExperimentResultDataCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppendExperimentResultDataHandler.html" data-type="entity-link" >AppendExperimentResultDataHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApplicationReadyEvent.html" data-type="entity-link" >ApplicationReadyEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AssetPlayerAlreadyRunningException.html" data-type="entity-link" >AssetPlayerAlreadyRunningException</a>
                            </li>
                            <li class="link">
                                <a href="classes/AssetPlayerMainPathNotDefinedException.html" data-type="entity-link" >AssetPlayerMainPathNotDefinedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/AssetPlayerModuleConfigFactoryImpl.html" data-type="entity-link" >AssetPlayerModuleConfigFactoryImpl</a>
                            </li>
                            <li class="link">
                                <a href="classes/AssetPlayerNotRunningException.html" data-type="entity-link" >AssetPlayerNotRunningException</a>
                            </li>
                            <li class="link">
                                <a href="classes/AssetPlayerPythonPathNotDefinedException.html" data-type="entity-link" >AssetPlayerPythonPathNotDefinedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/AssignUserRoleCommand.html" data-type="entity-link" >AssignUserRoleCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/AssignUserRoleHandler.html" data-type="entity-link" >AssignUserRoleHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthModuleConfigFactoryImpl.html" data-type="entity-link" >AuthModuleConfigFactoryImpl</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseAsyncConfigModule.html" data-type="entity-link" >BaseAsyncConfigModule</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseBlockingHandler.html" data-type="entity-link" >BaseBlockingHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseEntityTransformerService.html" data-type="entity-link" >BaseEntityTransformerService</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseError.html" data-type="entity-link" >BaseError</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseExperimentRepository.html" data-type="entity-link" >BaseExperimentRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseIpcBlockingHandler.html" data-type="entity-link" >BaseIpcBlockingHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseRepository.html" data-type="entity-link" >BaseRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseSeederService.html" data-type="entity-link" >BaseSeederService</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseStimulatorBlockingHandler.html" data-type="entity-link" >BaseStimulatorBlockingHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/BroadcastCommand.html" data-type="entity-link" >BroadcastCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/BroadcastHandler.html" data-type="entity-link" >BroadcastHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CheckStimulatorStateConsistencyCommand.html" data-type="entity-link" >CheckStimulatorStateConsistencyCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/CheckStimulatorStateConsistencyHandler.html" data-type="entity-link" >CheckStimulatorStateConsistencyHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ClientConnectedEvent.html" data-type="entity-link" >ClientConnectedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/ClientConnectionReadyEvent.html" data-type="entity-link" >ClientConnectionReadyEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/ClientDisconnectedEvent.html" data-type="entity-link" >ClientDisconnectedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/CloseCommand.html" data-type="entity-link" >CloseCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/CloseHandler.html" data-type="entity-link" >CloseHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommonModuleConfigFactoryImpl.html" data-type="entity-link" >CommonModuleConfigFactoryImpl</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConnectionClientReadyHandler.html" data-type="entity-link" >ConnectionClientReadyHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConsoleTransport.html" data-type="entity-link" >ConsoleTransport</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContentWasNotWrittenException.html" data-type="entity-link" >ContentWasNotWrittenException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ControllerException.html" data-type="entity-link" >ControllerException</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateNewExperimentRoundToClientCommand.html" data-type="entity-link" >CreateNewExperimentRoundToClientCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateNewExperimentRoundToClientHandler.html" data-type="entity-link" >CreateNewExperimentRoundToClientHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateNewFolderCommand.html" data-type="entity-link" >CreateNewFolderCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateNewFolderHandler.html" data-type="entity-link" >CreateNewFolderHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/CvepOutputDto.html" data-type="entity-link" >CvepOutputDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CycleCountingExperimentStopCondition.html" data-type="entity-link" >CycleCountingExperimentStopCondition</a>
                            </li>
                            <li class="link">
                                <a href="classes/DatabaseDumpCommand.html" data-type="entity-link" >DatabaseDumpCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/DatabaseDumpHandler.html" data-type="entity-link" >DatabaseDumpHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DatabaseModuleConfigFactoryImpl.html" data-type="entity-link" >DatabaseModuleConfigFactoryImpl</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteFileCommand.html" data-type="entity-link" >DeleteFileCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteFileHandler.html" data-type="entity-link" >DeleteFileHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DisableTriggersCommand.html" data-type="entity-link" >DisableTriggersCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/DisableTriggersHandler.html" data-type="entity-link" >DisableTriggersHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DiscoverHandler.html" data-type="entity-link" >DiscoverHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DiscoverQuery.html" data-type="entity-link" >DiscoverQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/DTO.html" data-type="entity-link" >DTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/DtoNotFoundException.html" data-type="entity-link" >DtoNotFoundException</a>
                            </li>
                            <li class="link">
                                <a href="classes/DtoService.html" data-type="entity-link" >DtoService</a>
                            </li>
                            <li class="link">
                                <a href="classes/DummySeedService.html" data-type="entity-link" >DummySeedService</a>
                            </li>
                            <li class="link">
                                <a href="classes/EnableTriggersCommand.html" data-type="entity-link" >EnableTriggersCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/EnableTriggersHandler.html" data-type="entity-link" >EnableTriggersHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntityStatisticsSerializer.html" data-type="entity-link" >EntityStatisticsSerializer</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErpOutputDTO.html" data-type="entity-link" >ErpOutputDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ErrorMiddleware.html" data-type="entity-link" >ErrorMiddleware</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExitMessage.html" data-type="entity-link" >ExitMessage</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperientAssetsMessage.html" data-type="entity-link" >ExperientAssetsMessage</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentAlreadyExistsException.html" data-type="entity-link" >ExperimentAlreadyExistsException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentByIdHandler.html" data-type="entity-link" >ExperimentByIdHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentByIdQuery.html" data-type="entity-link" >ExperimentByIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentClearCommand.html" data-type="entity-link" >ExperimentClearCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentClearedEvent.html" data-type="entity-link" >ExperimentClearedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentClearHandler.html" data-type="entity-link" >ExperimentClearHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentCvepDTO.html" data-type="entity-link" >ExperimentCvepDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentCvepProtocol.html" data-type="entity-link" >ExperimentCvepProtocol</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentDeleteCommand.html" data-type="entity-link" >ExperimentDeleteCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentDeleteHandler.html" data-type="entity-link" >ExperimentDeleteHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentDoNotSupportSequencesException.html" data-type="entity-link" >ExperimentDoNotSupportSequencesException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentDTO.html" data-type="entity-link" >ExperimentDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentErpDTO.html" data-type="entity-link" >ExperimentErpDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentErpOutputDependencyEntity.html" data-type="entity-link" >ExperimentErpOutputDependencyEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentErpProtocol.html" data-type="entity-link" >ExperimentErpProtocol</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentFinishCommand.html" data-type="entity-link" >ExperimentFinishCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentFinishedEvent.html" data-type="entity-link" >ExperimentFinishedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentFinishHandler.html" data-type="entity-link" >ExperimentFinishHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentFvepDTO.html" data-type="entity-link" >ExperimentFvepDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentFvepProtocol.html" data-type="entity-link" >ExperimentFvepProtocol</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentIdNotFoundException.html" data-type="entity-link" >ExperimentIdNotFoundException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentInitializedEvent.html" data-type="entity-link" >ExperimentInitializedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentInsertCommand.html" data-type="entity-link" >ExperimentInsertCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentInsertHandler.html" data-type="entity-link" >ExperimentInsertHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentIpcDisconnectedHandler.html" data-type="entity-link" >ExperimentIpcDisconnectedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentIsNotInitializedException.html" data-type="entity-link" >ExperimentIsNotInitializedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentMultimediaHandler.html" data-type="entity-link" >ExperimentMultimediaHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentMultimediaQuery.html" data-type="entity-link" >ExperimentMultimediaQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentNameExistsHandler.html" data-type="entity-link" >ExperimentNameExistsHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentNameExistsQuery.html" data-type="entity-link" >ExperimentNameExistsQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentNotValidException.html" data-type="entity-link" >ExperimentNotValidException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentOutputDto.html" data-type="entity-link" >ExperimentOutputDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentOutputEntity.html" data-type="entity-link" >ExperimentOutputEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentPauseCommand.html" data-type="entity-link" >ExperimentPauseCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentPauseHandler.html" data-type="entity-link" >ExperimentPauseHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentProtocol.html" data-type="entity-link" >ExperimentProtocol</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentReaDTO.html" data-type="entity-link" >ExperimentReaDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentReaProtocol.html" data-type="entity-link" >ExperimentReaProtocol</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultAlreadyExistsException.html" data-type="entity-link" >ExperimentResultAlreadyExistsException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultByIdHandler.html" data-type="entity-link" >ExperimentResultByIdHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultByIdQuery.html" data-type="entity-link" >ExperimentResultByIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultClearCommand.html" data-type="entity-link" >ExperimentResultClearCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultClearHandler.html" data-type="entity-link" >ExperimentResultClearHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultDataHandler.html" data-type="entity-link" >ExperimentResultDataHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultDataQuery.html" data-type="entity-link" >ExperimentResultDataQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultDeleteCommand.html" data-type="entity-link" >ExperimentResultDeleteCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultDeleteHandler.html" data-type="entity-link" >ExperimentResultDeleteHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultDTO.html" data-type="entity-link" >ExperimentResultDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultIdNotFoundException.html" data-type="entity-link" >ExperimentResultIdNotFoundException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultInitializeCommand.html" data-type="entity-link" >ExperimentResultInitializeCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultInitializeHandler.html" data-type="entity-link" >ExperimentResultInitializeHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultInsertCommand.html" data-type="entity-link" >ExperimentResultInsertCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultInsertHandler.html" data-type="entity-link" >ExperimentResultInsertHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultIsNotInitializedException.html" data-type="entity-link" >ExperimentResultIsNotInitializedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultNameExistsHandler.html" data-type="entity-link" >ExperimentResultNameExistsHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultNameExistsQuery.html" data-type="entity-link" >ExperimentResultNameExistsQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultNotValidException.html" data-type="entity-link" >ExperimentResultNotValidException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultRoundIsNotInitializedException.html" data-type="entity-link" >ExperimentResultRoundIsNotInitializedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultsAllHandler.html" data-type="entity-link" >ExperimentResultsAllHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultsAllQuery.html" data-type="entity-link" >ExperimentResultsAllQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultsRepository.html" data-type="entity-link" >ExperimentResultsRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultUpdateCommand.html" data-type="entity-link" >ExperimentResultUpdateCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultUpdateHandler.html" data-type="entity-link" >ExperimentResultUpdateHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultValidateCommand.html" data-type="entity-link" >ExperimentResultValidateCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultValidateHandler.html" data-type="entity-link" >ExperimentResultValidateHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultWasCreatedEvent.html" data-type="entity-link" >ExperimentResultWasCreatedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultWasCreatedHandler.html" data-type="entity-link" >ExperimentResultWasCreatedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultWasDeletedEvent.html" data-type="entity-link" >ExperimentResultWasDeletedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultWasDeletedHandler.html" data-type="entity-link" >ExperimentResultWasDeletedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultWasInitializedEvent.html" data-type="entity-link" >ExperimentResultWasInitializedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultWasNotCreatedException.html" data-type="entity-link" >ExperimentResultWasNotCreatedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultWasNotDeletedException.html" data-type="entity-link" >ExperimentResultWasNotDeletedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultWasNotUpdatedException.html" data-type="entity-link" >ExperimentResultWasNotUpdatedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultWasUpdatedEvent.html" data-type="entity-link" >ExperimentResultWasUpdatedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentResultWasUpdatedHandler.html" data-type="entity-link" >ExperimentResultWasUpdatedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentRunCommand.html" data-type="entity-link" >ExperimentRunCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentRunHandler.html" data-type="entity-link" >ExperimentRunHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentsAllHandler.html" data-type="entity-link" >ExperimentsAllHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentsAllQuery.html" data-type="entity-link" >ExperimentsAllQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentsApplicationReadyHandler.html" data-type="entity-link" >ExperimentsApplicationReadyHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentSetupCommand.html" data-type="entity-link" >ExperimentSetupCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentSetupHandler.html" data-type="entity-link" >ExperimentSetupHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentsRegisterDtoCommand.html" data-type="entity-link" >ExperimentsRegisterDtoCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentsRegisterDtoHandler.html" data-type="entity-link" >ExperimentsRegisterDtoHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentStopConditionRepository.html" data-type="entity-link" >ExperimentStopConditionRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentTvepDTO.html" data-type="entity-link" >ExperimentTvepDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentTvepProtocol.html" data-type="entity-link" >ExperimentTvepProtocol</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentUpdateCommand.html" data-type="entity-link" >ExperimentUpdateCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentUpdateHandler.html" data-type="entity-link" >ExperimentUpdateHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentUploadCommand.html" data-type="entity-link" >ExperimentUploadCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentUploadHandler.html" data-type="entity-link" >ExperimentUploadHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentValidateCommand.html" data-type="entity-link" >ExperimentValidateCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentValidateHandler.html" data-type="entity-link" >ExperimentValidateHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentWasCreatedEvent.html" data-type="entity-link" >ExperimentWasCreatedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentWasCreatedHandler.html" data-type="entity-link" >ExperimentWasCreatedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentWasDeletedEvent.html" data-type="entity-link" >ExperimentWasDeletedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentWasDeletedHandler.html" data-type="entity-link" >ExperimentWasDeletedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentWasNotCreatedException.html" data-type="entity-link" >ExperimentWasNotCreatedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentWasNotDeletedException.html" data-type="entity-link" >ExperimentWasNotDeletedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentWasNotUpdatedException.html" data-type="entity-link" >ExperimentWasNotUpdatedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentWasUpdatedEvent.html" data-type="entity-link" >ExperimentWasUpdatedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExperimentWasUpdatedHandler.html" data-type="entity-link" >ExperimentWasUpdatedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/FakeSerialPort.html" data-type="entity-link" >FakeSerialPort</a>
                            </li>
                            <li class="link">
                                <a href="classes/FakeSerialPortFactory.html" data-type="entity-link" >FakeSerialPortFactory</a>
                            </li>
                            <li class="link">
                                <a href="classes/FakeSerialResponder.html" data-type="entity-link" >FakeSerialResponder</a>
                            </li>
                            <li class="link">
                                <a href="classes/FakeStimulatorDevice.html" data-type="entity-link" >FakeStimulatorDevice</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileAccessRestrictedException.html" data-type="entity-link" >FileAccessRestrictedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileAlreadyExistsException.html" data-type="entity-link" >FileAlreadyExistsException</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileBrowserModuleConfigFactoryImpl.html" data-type="entity-link" >FileBrowserModuleConfigFactoryImpl</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileNotFoundException.html" data-type="entity-link" >FileNotFoundException</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileTransport.html" data-type="entity-link" >FileTransport</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileUploadFailedEvent.html" data-type="entity-link" >FileUploadFailedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileUploadFailedHandler.html" data-type="entity-link" >FileUploadFailedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileWasDeletedEvent.html" data-type="entity-link" >FileWasDeletedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileWasUploadedEvent.html" data-type="entity-link" >FileWasUploadedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/FileWasUploadedHandler.html" data-type="entity-link" >FileWasUploadedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/FillInitialIoDataCommand.html" data-type="entity-link" >FillInitialIoDataCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/FillInitialIoDataHandler.html" data-type="entity-link" >FillInitialIoDataHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/FirmwareFileDeleteCommand.html" data-type="entity-link" >FirmwareFileDeleteCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/FirmwareFileDeleteHandler.html" data-type="entity-link" >FirmwareFileDeleteHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/FirmwareUpdateCommand.html" data-type="entity-link" >FirmwareUpdateCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/FirmwareUpdatedEvent.html" data-type="entity-link" >FirmwareUpdatedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/FirmwareUpdatedHandler.html" data-type="entity-link" >FirmwareUpdatedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/FirmwareUpdateFailedException.html" data-type="entity-link" >FirmwareUpdateFailedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/FirmwareUpdateHandler.html" data-type="entity-link" >FirmwareUpdateHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolderIsUnableToCreateException.html" data-type="entity-link" >FolderIsUnableToCreateException</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolderWasCreatedEvent.html" data-type="entity-link" >FolderWasCreatedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/FolderWasCreatedHandler.html" data-type="entity-link" >FolderWasCreatedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/FvepOutputDTO.html" data-type="entity-link" >FvepOutputDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAclByRoleHandler.html" data-type="entity-link" >GetAclByRoleHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAclByRoleQuery.html" data-type="entity-link" >GetAclByRoleQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllAclActionsHandler.html" data-type="entity-link" >GetAllAclActionsHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllAclActionsQuery.html" data-type="entity-link" >GetAllAclActionsQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllAclHandler.html" data-type="entity-link" >GetAllAclHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllAclPossessionsHandler.html" data-type="entity-link" >GetAllAclPossessionsHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllAclPossessionsQuery.html" data-type="entity-link" >GetAllAclPossessionsQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllAclQuery.html" data-type="entity-link" >GetAllAclQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllAclResourcesHandler.html" data-type="entity-link" >GetAllAclResourcesHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllAclResourcesQuery.html" data-type="entity-link" >GetAllAclResourcesQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllAclRolesHandler.html" data-type="entity-link" >GetAllAclRolesHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAllAclRolesQuery.html" data-type="entity-link" >GetAllAclRolesQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetContentHandler.html" data-type="entity-link" >GetContentHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetContentQuery.html" data-type="entity-link" >GetContentQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCurrentExperimentIdHandler.html" data-type="entity-link" >GetCurrentExperimentIdHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCurrentExperimentIdQuery.html" data-type="entity-link" >GetCurrentExperimentIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCurrentSequenceHandler.html" data-type="entity-link" >GetCurrentSequenceHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetCurrentSequenceQuery.html" data-type="entity-link" >GetCurrentSequenceQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetDefaultRolesHandler.html" data-type="entity-link" >GetDefaultRolesHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetDefaultRolesQuery.html" data-type="entity-link" >GetDefaultRolesQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetPublicPathHandler.html" data-type="entity-link" >GetPublicPathHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetPublicPathQuery.html" data-type="entity-link" >GetPublicPathQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSettingsHandler.html" data-type="entity-link" >GetSettingsHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetSettingsQuery.html" data-type="entity-link" >GetSettingsQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetStimulatorConnectionStatusHandler.html" data-type="entity-link" >GetStimulatorConnectionStatusHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetStimulatorConnectionStatusQuery.html" data-type="entity-link" >GetStimulatorConnectionStatusQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/Initialization1624546147368.html" data-type="entity-link" >Initialization1624546147368</a>
                            </li>
                            <li class="link">
                                <a href="classes/InitializeExperimentResultsDirectoryCommand.html" data-type="entity-link" >InitializeExperimentResultsDirectoryCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/InitializeExperimentResultsDirectoryHandler.html" data-type="entity-link" >InitializeExperimentResultsDirectoryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/InitializeTriggersCommand.html" data-type="entity-link" >InitializeTriggersCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/InitializeTriggersHandler.html" data-type="entity-link" >InitializeTriggersHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/InvalidSequenceSizeException.html" data-type="entity-link" >InvalidSequenceSizeException</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcAlreadyOpenException.html" data-type="entity-link" >IpcAlreadyOpenException</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcBlockingCommandFailedEvent.html" data-type="entity-link" >IpcBlockingCommandFailedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcCloseCommand.html" data-type="entity-link" >IpcCloseCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcClosedEvent.html" data-type="entity-link" >IpcClosedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcClosedHandler.html" data-type="entity-link" >IpcClosedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcCloseHandler.html" data-type="entity-link" >IpcCloseHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcConnectedEvent.html" data-type="entity-link" >IpcConnectedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcConnectedHandler.html" data-type="entity-link" >IpcConnectedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcConnectionStatusHandler.html" data-type="entity-link" >IpcConnectionStatusHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcConnectionStatusQuery.html" data-type="entity-link" >IpcConnectionStatusQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcDisconnectedEvent.html" data-type="entity-link" >IpcDisconnectedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcDisconnectedHandler.html" data-type="entity-link" >IpcDisconnectedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcErrorEvent.html" data-type="entity-link" >IpcErrorEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcErrorHandler.html" data-type="entity-link" >IpcErrorHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcEvent.html" data-type="entity-link" >IpcEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcKillCommand.html" data-type="entity-link" >IpcKillCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcKilledEvent.html" data-type="entity-link" >IpcKilledEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcKilledHandler.html" data-type="entity-link" >IpcKilledHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcKillHandler.html" data-type="entity-link" >IpcKillHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcListeningEvent.html" data-type="entity-link" >IpcListeningEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcListeningHandler.html" data-type="entity-link" >IpcListeningHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcMessageEvent.html" data-type="entity-link" >IpcMessageEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcMessageHandler.html" data-type="entity-link" >IpcMessageHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcOpenCommand.html" data-type="entity-link" >IpcOpenCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcOpenHandler.html" data-type="entity-link" >IpcOpenHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcOutputSynchronizationExperimentIdMissingException.html" data-type="entity-link" >IpcOutputSynchronizationExperimentIdMissingException</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcOutputSynchronizationUpdatedEvent.html" data-type="entity-link" >IpcOutputSynchronizationUpdatedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcOutputSynchronizationUpdatedHandler.html" data-type="entity-link" >IpcOutputSynchronizationUpdatedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcSendStimulatorStateChangeCommand.html" data-type="entity-link" >IpcSendStimulatorStateChangeCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcSendStimulatorStateChangeHandler.html" data-type="entity-link" >IpcSendStimulatorStateChangeHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcSetExperimentAssetCommand.html" data-type="entity-link" >IpcSetExperimentAssetCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcSetExperimentAssetHandler.html" data-type="entity-link" >IpcSetExperimentAssetHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcSetOutputSynchronizationCommand.html" data-type="entity-link" >IpcSetOutputSynchronizationCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcSetOutputSynchronizationHandler.html" data-type="entity-link" >IpcSetOutputSynchronizationHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcSetPublicPathCommand.html" data-type="entity-link" >IpcSetPublicPathCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcSetPublicPathHandler.html" data-type="entity-link" >IpcSetPublicPathHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcSettingsLoadedHandler.html" data-type="entity-link" >IpcSettingsLoadedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcSpawnCommand.html" data-type="entity-link" >IpcSpawnCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcSpawnHandler.html" data-type="entity-link" >IpcSpawnHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcToggleOutputCommand.html" data-type="entity-link" >IpcToggleOutputCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcToggleOutputHandler.html" data-type="entity-link" >IpcToggleOutputHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcUpdateOutputDataCommand.html" data-type="entity-link" >IpcUpdateOutputDataCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcUpdateOutputDataHandler.html" data-type="entity-link" >IpcUpdateOutputDataHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcWasOpenEvent.html" data-type="entity-link" >IpcWasOpenEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/IpcWasOpenHandler.html" data-type="entity-link" >IpcWasOpenHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/LastKnowStimulatorStateHandler.html" data-type="entity-link" >LastKnowStimulatorStateHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/LastKnowStimulatorStateQuery.html" data-type="entity-link" >LastKnowStimulatorStateQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoadSettingsCommand.html" data-type="entity-link" >LoadSettingsCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoadSettingsHandler.html" data-type="entity-link" >LoadSettingsHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/Logger.html" data-type="entity-link" >Logger</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginCommand.html" data-type="entity-link" >LoginCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginFailedException.html" data-type="entity-link" >LoginFailedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginHandler.html" data-type="entity-link" >LoginHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/LogModuleConfigFactoryImpl.html" data-type="entity-link" >LogModuleConfigFactoryImpl</a>
                            </li>
                            <li class="link">
                                <a href="classes/LogoutCommand.html" data-type="entity-link" >LogoutCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/LogoutHandler.html" data-type="entity-link" >LogoutHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/MergePrivatePathHandler.html" data-type="entity-link" >MergePrivatePathHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/MergePrivatePathQuery.html" data-type="entity-link" >MergePrivatePathQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/MergePublicPathHandler.html" data-type="entity-link" >MergePublicPathHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/MergePublicPathQuery.html" data-type="entity-link" >MergePublicPathQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/MessageArivedEvent.html" data-type="entity-link" >MessageArivedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/NoIpcOpenException.html" data-type="entity-link" >NoIpcOpenException</a>
                            </li>
                            <li class="link">
                                <a href="classes/NoOpLogger.html" data-type="entity-link" >NoOpLogger</a>
                            </li>
                            <li class="link">
                                <a href="classes/NoStopCondition.html" data-type="entity-link" >NoStopCondition</a>
                            </li>
                            <li class="link">
                                <a href="classes/NoUploadedExperimentException.html" data-type="entity-link" >NoUploadedExperimentException</a>
                            </li>
                            <li class="link">
                                <a href="classes/OpenCommand.html" data-type="entity-link" >OpenCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/OpenHandler.html" data-type="entity-link" >OpenHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/OutputCountingExperimentStopCondition.html" data-type="entity-link" >OutputCountingExperimentStopCondition</a>
                            </li>
                            <li class="link">
                                <a href="classes/OutputSynchronizationStateChangedMessage.html" data-type="entity-link" >OutputSynchronizationStateChangedMessage</a>
                            </li>
                            <li class="link">
                                <a href="classes/OutputTypeDTO.html" data-type="entity-link" >OutputTypeDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ParseStimulatorDataHandler.html" data-type="entity-link" >ParseStimulatorDataHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ParseStimulatorDataQuery.html" data-type="entity-link" >ParseStimulatorDataQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/PermissionDeniedException.html" data-type="entity-link" >PermissionDeniedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/PlayerBlockingCommandFailedHandler.html" data-type="entity-link" >PlayerBlockingCommandFailedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/PlayerClientReadyHandler.html" data-type="entity-link" >PlayerClientReadyHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/PlayerConfigurationHandler.html" data-type="entity-link" >PlayerConfigurationHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/PlayerConfigurationQuery.html" data-type="entity-link" >PlayerConfigurationQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/PlayerExperimentClearedHandler.html" data-type="entity-link" >PlayerExperimentClearedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/PlayerExperimentFinishedHandler.html" data-type="entity-link" >PlayerExperimentFinishedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/PlayerExperimentInitializedHandler.html" data-type="entity-link" >PlayerExperimentInitializedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/PlayerExperimentResultWasInitializedHandler.html" data-type="entity-link" >PlayerExperimentResultWasInitializedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/PlayerLocalConfigurationHandler.html" data-type="entity-link" >PlayerLocalConfigurationHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/PlayerLocalConfigurationQuery.html" data-type="entity-link" >PlayerLocalConfigurationQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/PortIsAlreadyOpenException.html" data-type="entity-link" >PortIsAlreadyOpenException</a>
                            </li>
                            <li class="link">
                                <a href="classes/PortIsNotOpenException.html" data-type="entity-link" >PortIsNotOpenException</a>
                            </li>
                            <li class="link">
                                <a href="classes/PortIsUnableToCloseException.html" data-type="entity-link" >PortIsUnableToCloseException</a>
                            </li>
                            <li class="link">
                                <a href="classes/PortIsUnableToOpenException.html" data-type="entity-link" >PortIsUnableToOpenException</a>
                            </li>
                            <li class="link">
                                <a href="classes/PrepareExperimentPlayerCommand.html" data-type="entity-link" >PrepareExperimentPlayerCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/PrepareExperimentPlayerHandler.html" data-type="entity-link" >PrepareExperimentPlayerHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/PrepareNextExperimentRoundCommand.html" data-type="entity-link" >PrepareNextExperimentRoundCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/PrepareNextExperimentRoundHandler.html" data-type="entity-link" >PrepareNextExperimentRoundHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProcessStimulatorIoDataCommand.html" data-type="entity-link" >ProcessStimulatorIoDataCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProcessStimulatorIoDataHandler.html" data-type="entity-link" >ProcessStimulatorIoDataHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProcessStimulatorNextSequencePartRequestCommand.html" data-type="entity-link" >ProcessStimulatorNextSequencePartRequestCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProcessStimulatorNextSequencePartRequestHandler.html" data-type="entity-link" >ProcessStimulatorNextSequencePartRequestHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/PublishClientReadyCommand.html" data-type="entity-link" >PublishClientReadyCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/PublishClientReadyHandler.html" data-type="entity-link" >PublishClientReadyHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReadPrivateJSONFileHandler.html" data-type="entity-link" >ReadPrivateJSONFileHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReadPrivateJSONFileQuery.html" data-type="entity-link" >ReadPrivateJSONFileQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/RealSerialPortFactory.html" data-type="entity-link" >RealSerialPortFactory</a>
                            </li>
                            <li class="link">
                                <a href="classes/ReaOutputDto.html" data-type="entity-link" >ReaOutputDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshJwtCommand.html" data-type="entity-link" >RefreshJwtCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshJwtHandler.html" data-type="entity-link" >RefreshJwtHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterUserCommand.html" data-type="entity-link" >RegisterUserCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterUserHandler.html" data-type="entity-link" >RegisterUserHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/RouletteWheelSequenceGenerator.html" data-type="entity-link" >RouletteWheelSequenceGenerator</a>
                            </li>
                            <li class="link">
                                <a href="classes/SaveSerialPathIfNecessaryCommand.html" data-type="entity-link" >SaveSerialPathIfNecessaryCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SaveSerialPathIfNecessaryHandler.html" data-type="entity-link" >SaveSerialPathIfNecessaryHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SeedApplicationReadyHandler.html" data-type="entity-link" >SeedApplicationReadyHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SeedCommand.html" data-type="entity-link" >SeedCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SeedHandler.html" data-type="entity-link" >SeedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SeedRepositoryEvent.html" data-type="entity-link" >SeedRepositoryEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendAssetConfigurationToIpcCommand.html" data-type="entity-link" >SendAssetConfigurationToIpcCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendAssetConfigurationToIpcHandler.html" data-type="entity-link" >SendAssetConfigurationToIpcHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendCommand.html" data-type="entity-link" >SendCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendExperimentResultCreatedToClientCommand.html" data-type="entity-link" >SendExperimentResultCreatedToClientCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendExperimentResultCreatedToClientHandler.html" data-type="entity-link" >SendExperimentResultCreatedToClientHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendHandler.html" data-type="entity-link" >SendHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendPlayerStateToClientCommand.html" data-type="entity-link" >SendPlayerStateToClientCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendPlayerStateToClientHandler.html" data-type="entity-link" >SendPlayerStateToClientHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendStimulatorConnectedToClientCommand.html" data-type="entity-link" >SendStimulatorConnectedToClientCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendStimulatorConnectedToClientHandler.html" data-type="entity-link" >SendStimulatorConnectedToClientHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendStimulatorDisconnectedToClientCommand.html" data-type="entity-link" >SendStimulatorDisconnectedToClientCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendStimulatorDisconnectedToClientHandler.html" data-type="entity-link" >SendStimulatorDisconnectedToClientHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendStimulatorIoDataToClientCommand.html" data-type="entity-link" >SendStimulatorIoDataToClientCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendStimulatorIoDataToClientHandler.html" data-type="entity-link" >SendStimulatorIoDataToClientHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendStimulatorStateChangeToClientCommand.html" data-type="entity-link" >SendStimulatorStateChangeToClientCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendStimulatorStateChangeToClientHandler.html" data-type="entity-link" >SendStimulatorStateChangeToClientHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendStimulatorStateChangeToIpcCommand.html" data-type="entity-link" >SendStimulatorStateChangeToIpcCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SendStimulatorStateChangeToIpcHandler.html" data-type="entity-link" >SendStimulatorStateChangeToIpcHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceAlreadyExistsException.html" data-type="entity-link" >SequenceAlreadyExistsException</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceByIdHandler.html" data-type="entity-link" >SequenceByIdHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceByIdQuery.html" data-type="entity-link" >SequenceByIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceDeleteCommand.html" data-type="entity-link" >SequenceDeleteCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceDeleteHandler.html" data-type="entity-link" >SequenceDeleteHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceDTO.html" data-type="entity-link" >SequenceDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceFromExperimentCommand.html" data-type="entity-link" >SequenceFromExperimentCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceFromExperimentHandler.html" data-type="entity-link" >SequenceFromExperimentHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceGenerateCommand.html" data-type="entity-link" >SequenceGenerateCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceGenerateHandler.html" data-type="entity-link" >SequenceGenerateHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceGeneratorFactory.html" data-type="entity-link" >SequenceGeneratorFactory</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceIdNotFoundException.html" data-type="entity-link" >SequenceIdNotFoundException</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceInsertCommand.html" data-type="entity-link" >SequenceInsertCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceInsertHandler.html" data-type="entity-link" >SequenceInsertHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceNameExistsHandler.html" data-type="entity-link" >SequenceNameExistsHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceNameExistsQuery.html" data-type="entity-link" >SequenceNameExistsQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceNextPartCommand.html" data-type="entity-link" >SequenceNextPartCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceNextPartHandler.html" data-type="entity-link" >SequenceNextPartHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceNotValidException.html" data-type="entity-link" >SequenceNotValidException</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceProtocol.html" data-type="entity-link" >SequenceProtocol</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequencesAllHandler.html" data-type="entity-link" >SequencesAllHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequencesAllQuery.html" data-type="entity-link" >SequencesAllQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequencesForExperimentHandler.html" data-type="entity-link" >SequencesForExperimentHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequencesForExperimentQuery.html" data-type="entity-link" >SequencesForExperimentQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceUpdateCommand.html" data-type="entity-link" >SequenceUpdateCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceUpdateHandler.html" data-type="entity-link" >SequenceUpdateHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceValidateCommand.html" data-type="entity-link" >SequenceValidateCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceValidateHandler.html" data-type="entity-link" >SequenceValidateHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceWasCreatedEvent.html" data-type="entity-link" >SequenceWasCreatedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceWasCreatedHandler.html" data-type="entity-link" >SequenceWasCreatedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceWasDeletedEvent.html" data-type="entity-link" >SequenceWasDeletedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceWasDeletedHandler.html" data-type="entity-link" >SequenceWasDeletedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceWasGeneratedEvent.html" data-type="entity-link" >SequenceWasGeneratedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceWasGeneratedHandler.html" data-type="entity-link" >SequenceWasGeneratedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceWasNotCreatedException.html" data-type="entity-link" >SequenceWasNotCreatedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceWasNotDeletedException.html" data-type="entity-link" >SequenceWasNotDeletedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceWasNotUpdatedException.html" data-type="entity-link" >SequenceWasNotUpdatedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceWasUpdatedEvent.html" data-type="entity-link" >SequenceWasUpdatedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SequenceWasUpdatedHandler.html" data-type="entity-link" >SequenceWasUpdatedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SerialClosedEvent.html" data-type="entity-link" >SerialClosedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SerialOpenEvent.html" data-type="entity-link" >SerialOpenEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SerialOpenHandler.html" data-type="entity-link" >SerialOpenHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SerialPortFactory.html" data-type="entity-link" >SerialPortFactory</a>
                            </li>
                            <li class="link">
                                <a href="classes/SerialService.html" data-type="entity-link" >SerialService</a>
                            </li>
                            <li class="link">
                                <a href="classes/ServerPublicPathMessage.html" data-type="entity-link" >ServerPublicPathMessage</a>
                            </li>
                            <li class="link">
                                <a href="classes/SettingsApplicationReadyHandler.html" data-type="entity-link" >SettingsApplicationReadyHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/SettingsModuleConfigFactoryImpl.html" data-type="entity-link" >SettingsModuleConfigFactoryImpl</a>
                            </li>
                            <li class="link">
                                <a href="classes/SettingsWasLoadedEvent.html" data-type="entity-link" >SettingsWasLoadedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/SocketIoAdapter.html" data-type="entity-link" >SocketIoAdapter</a>
                            </li>
                            <li class="link">
                                <a href="classes/SocketService.html" data-type="entity-link" >SocketService</a>
                            </li>
                            <li class="link">
                                <a href="classes/StartNewExperimentRoundCommand.html" data-type="entity-link" >StartNewExperimentRoundCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/StartNewExperimentRoundHandler.html" data-type="entity-link" >StartNewExperimentRoundHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/StimLibCommonModule.html" data-type="entity-link" >StimLibCommonModule</a>
                            </li>
                            <li class="link">
                                <a href="classes/StimLibDatabaseModule.html" data-type="entity-link" >StimLibDatabaseModule</a>
                            </li>
                            <li class="link">
                                <a href="classes/StimLibDtoCoreModule.html" data-type="entity-link" >StimLibDtoCoreModule</a>
                            </li>
                            <li class="link">
                                <a href="classes/StimLibDtoModule.html" data-type="entity-link" >StimLibDtoModule</a>
                            </li>
                            <li class="link">
                                <a href="classes/StimLibLogModule.html" data-type="entity-link" >StimLibLogModule</a>
                            </li>
                            <li class="link">
                                <a href="classes/StimulatorBlockingCommandFailedEvent.html" data-type="entity-link" >StimulatorBlockingCommandFailedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/StimulatorBlockingCommandFailedHandler.html" data-type="entity-link" >StimulatorBlockingCommandFailedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/StimulatorDataEvent.html" data-type="entity-link" >StimulatorDataEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/StimulatorDataHandler.html" data-type="entity-link" >StimulatorDataHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/StimulatorEvent.html" data-type="entity-link" >StimulatorEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/StimulatorIoChangeData.html" data-type="entity-link" >StimulatorIoChangeData</a>
                            </li>
                            <li class="link">
                                <a href="classes/StimulatorMemoryData.html" data-type="entity-link" >StimulatorMemoryData</a>
                            </li>
                            <li class="link">
                                <a href="classes/StimulatorModuleConfigFactoryImpl.html" data-type="entity-link" >StimulatorModuleConfigFactoryImpl</a>
                            </li>
                            <li class="link">
                                <a href="classes/StimulatorNextSequencePartData.html" data-type="entity-link" >StimulatorNextSequencePartData</a>
                            </li>
                            <li class="link">
                                <a href="classes/StimulatorRequestFinishData.html" data-type="entity-link" >StimulatorRequestFinishData</a>
                            </li>
                            <li class="link">
                                <a href="classes/StimulatorSetOutputCommand.html" data-type="entity-link" >StimulatorSetOutputCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/StimulatorSetOutputHandler.html" data-type="entity-link" >StimulatorSetOutputHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/StimulatorSettingsLoadedHandler.html" data-type="entity-link" >StimulatorSettingsLoadedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/StimulatorStateChangeMessage.html" data-type="entity-link" >StimulatorStateChangeMessage</a>
                            </li>
                            <li class="link">
                                <a href="classes/StimulatorStateCommand.html" data-type="entity-link" >StimulatorStateCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/StimulatorStateData.html" data-type="entity-link" >StimulatorStateData</a>
                            </li>
                            <li class="link">
                                <a href="classes/StimulatorStateHandler.html" data-type="entity-link" >StimulatorStateHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/StopConditionTypesHandler.html" data-type="entity-link" >StopConditionTypesHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/StopConditionTypesQuery.html" data-type="entity-link" >StopConditionTypesQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/ToggleOutputMessage.html" data-type="entity-link" >ToggleOutputMessage</a>
                            </li>
                            <li class="link">
                                <a href="classes/ToggleOutputSynchronizationMessage.html" data-type="entity-link" >ToggleOutputSynchronizationMessage</a>
                            </li>
                            <li class="link">
                                <a href="classes/TokenExpiredException.html" data-type="entity-link" >TokenExpiredException</a>
                            </li>
                            <li class="link">
                                <a href="classes/TokenNotFoundException.html" data-type="entity-link" >TokenNotFoundException</a>
                            </li>
                            <li class="link">
                                <a href="classes/TokenRefreshFailedException.html" data-type="entity-link" >TokenRefreshFailedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/TruncateCommand.html" data-type="entity-link" >TruncateCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/TruncateHandler.html" data-type="entity-link" >TruncateHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/TvepOutputDTO.html" data-type="entity-link" >TvepOutputDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UnauthorizedException.html" data-type="entity-link" >UnauthorizedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/UnknownStimulatorActionTypeException.html" data-type="entity-link" >UnknownStimulatorActionTypeException</a>
                            </li>
                            <li class="link">
                                <a href="classes/UnsupportedExperimentStopConditionException.html" data-type="entity-link" >UnsupportedExperimentStopConditionException</a>
                            </li>
                            <li class="link">
                                <a href="classes/UnsupportedStimulatorCommandException.html" data-type="entity-link" >UnsupportedStimulatorCommandException</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOutputDataMessage.html" data-type="entity-link" >UpdateOutputDataMessage</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateSettingsCommand.html" data-type="entity-link" >UpdateSettingsCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateSettingsFailedException.html" data-type="entity-link" >UpdateSettingsFailedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateSettingsHandler.html" data-type="entity-link" >UpdateSettingsHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UploadFilesCommand.html" data-type="entity-link" >UploadFilesCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UploadFilesHandler.html" data-type="entity-link" >UploadFilesHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserByEmailPasswordHandler.html" data-type="entity-link" >UserByEmailPasswordHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserByEmailPasswordQuery.html" data-type="entity-link" >UserByEmailPasswordQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserByIdHandler.html" data-type="entity-link" >UserByIdHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserByIdQuery.html" data-type="entity-link" >UserByIdQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserDeleteCommand.html" data-type="entity-link" >UserDeleteCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserDeleteHandler.html" data-type="entity-link" >UserDeleteHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserDTO.html" data-type="entity-link" >UserDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserIdNotFoundException.html" data-type="entity-link" >UserIdNotFoundException</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserInsertCommand.html" data-type="entity-link" >UserInsertCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserInsertHandler.html" data-type="entity-link" >UserInsertHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserNotFoundException.html" data-type="entity-link" >UserNotFoundException</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserNotValidException.html" data-type="entity-link" >UserNotValidException</a>
                            </li>
                            <li class="link">
                                <a href="classes/UsersByGroupHandler.html" data-type="entity-link" >UsersByGroupHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UsersByGroupQuery.html" data-type="entity-link" >UsersByGroupQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserUpdateCommand.html" data-type="entity-link" >UserUpdateCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserUpdateHandler.html" data-type="entity-link" >UserUpdateHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserValidateCommand.html" data-type="entity-link" >UserValidateCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserValidateHandler.html" data-type="entity-link" >UserValidateHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserWasCreatedEvent.html" data-type="entity-link" >UserWasCreatedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserWasCreatedHandler.html" data-type="entity-link" >UserWasCreatedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserWasDeletedEvent.html" data-type="entity-link" >UserWasDeletedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserWasNotCreatedException.html" data-type="entity-link" >UserWasNotCreatedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserWasNotDeletedException.html" data-type="entity-link" >UserWasNotDeletedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserWasNotRegistredException.html" data-type="entity-link" >UserWasNotRegistredException</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserWasNotUpdatedException.html" data-type="entity-link" >UserWasNotUpdatedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserWasUpdatedEvent.html" data-type="entity-link" >UserWasUpdatedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/WriteExperimentResultToFileCommand.html" data-type="entity-link" >WriteExperimentResultToFileCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/WriteExperimentResultToFileHandler.html" data-type="entity-link" >WriteExperimentResultToFileHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/WritePrivateJSONFileCommand.html" data-type="entity-link" >WritePrivateJSONFileCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/WritePrivateJsonFileHandler.html" data-type="entity-link" >WritePrivateJsonFileHandler</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AclActionSeeder.html" data-type="entity-link" >AclActionSeeder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AclActionsFacade.html" data-type="entity-link" >AclActionsFacade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AclEntityTransform.html" data-type="entity-link" >AclEntityTransform</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AclFacade.html" data-type="entity-link" >AclFacade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AclPossessionSeeder.html" data-type="entity-link" >AclPossessionSeeder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AclPossessionsFacade.html" data-type="entity-link" >AclPossessionsFacade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AclRepository.html" data-type="entity-link" >AclRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AclResourceSeeder.html" data-type="entity-link" >AclResourceSeeder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AclResourcesFacade.html" data-type="entity-link" >AclResourcesFacade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AclRoleSeeder.html" data-type="entity-link" >AclRoleSeeder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AclRolesFacade.html" data-type="entity-link" >AclRolesFacade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AclSeeder.html" data-type="entity-link" >AclSeeder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AclService.html" data-type="entity-link" >AclService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthFacade.html" data-type="entity-link" >AuthFacade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CommandIdService.html" data-type="entity-link" >CommandIdService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CorsMiddleware.html" data-type="entity-link" >CorsMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DatabaseConfigurator.html" data-type="entity-link" >DatabaseConfigurator</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DefaultFakeSerialResponder.html" data-type="entity-link" >DefaultFakeSerialResponder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExperimentCvepOutputSeeder.html" data-type="entity-link" >ExperimentCvepOutputSeeder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExperimentCvepRepository.html" data-type="entity-link" >ExperimentCvepRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExperimentCvepSeeder.html" data-type="entity-link" >ExperimentCvepSeeder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExperimentErpOutputDependencySeeder.html" data-type="entity-link" >ExperimentErpOutputDependencySeeder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExperimentErpOutputSeeder.html" data-type="entity-link" >ExperimentErpOutputSeeder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExperimentErpRepository.html" data-type="entity-link" >ExperimentErpRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExperimentErpSeeder.html" data-type="entity-link" >ExperimentErpSeeder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExperimentFvepOutputSeeder.html" data-type="entity-link" >ExperimentFvepOutputSeeder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExperimentFvepRepository.html" data-type="entity-link" >ExperimentFvepRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExperimentFvepSeeder.html" data-type="entity-link" >ExperimentFvepSeeder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExperimentProtocolCodec.html" data-type="entity-link" >ExperimentProtocolCodec</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExperimentReaOutputSeeder.html" data-type="entity-link" >ExperimentReaOutputSeeder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExperimentReaRepository.html" data-type="entity-link" >ExperimentReaRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExperimentReaSeeder.html" data-type="entity-link" >ExperimentReaSeeder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExperimentRepository.html" data-type="entity-link" >ExperimentRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExperimentResultSeeder.html" data-type="entity-link" >ExperimentResultSeeder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExperimentResultsSaga.html" data-type="entity-link" >ExperimentResultsSaga</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExperimentSeeder.html" data-type="entity-link" >ExperimentSeeder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExperimentStopConditionSeeder.html" data-type="entity-link" >ExperimentStopConditionSeeder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExperimentTvepOutputSeeder.html" data-type="entity-link" >ExperimentTvepOutputSeeder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExperimentTvepRepository.html" data-type="entity-link" >ExperimentTvepRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExperimentTvepSeeder.html" data-type="entity-link" >ExperimentTvepSeeder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FakeProtocol.html" data-type="entity-link" >FakeProtocol</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FakeSerialService.html" data-type="entity-link" >FakeSerialService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FileBrowserFacade.html" data-type="entity-link" >FileBrowserFacade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FileBrowserService.html" data-type="entity-link" >FileBrowserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GroupSeeder.html" data-type="entity-link" >GroupSeeder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HttpLoggerMiddleware.html" data-type="entity-link" >HttpLoggerMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IpcFacade.html" data-type="entity-link" >IpcFacade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IpcService.html" data-type="entity-link" >IpcService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IpcSocketSaga.html" data-type="entity-link" >IpcSocketSaga</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PlayerSaga.html" data-type="entity-link" >PlayerSaga</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RealSerialService.html" data-type="entity-link" >RealSerialService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RefreshTokenRepository.html" data-type="entity-link" >RefreshTokenRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RefreshTokenSeeder.html" data-type="entity-link" >RefreshTokenSeeder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SequenceProtocolCodec.html" data-type="entity-link" >SequenceProtocolCodec</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SequenceRepository.html" data-type="entity-link" >SequenceRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SequenceSaga.html" data-type="entity-link" >SequenceSaga</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SequenceSeeder.html" data-type="entity-link" >SequenceSeeder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SerialFacade.html" data-type="entity-link" >SerialFacade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SerialSaga.html" data-type="entity-link" >SerialSaga</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SettingsFacade.html" data-type="entity-link" >SettingsFacade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SettingsService.html" data-type="entity-link" >SettingsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SocketSaga.html" data-type="entity-link" >SocketSaga</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StimulatorFacade.html" data-type="entity-link" >StimulatorFacade</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StimulatorProtocol.html" data-type="entity-link" >StimulatorProtocol</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StimulatorSaga.html" data-type="entity-link" >StimulatorSaga</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StimulatorService.html" data-type="entity-link" >StimulatorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TokenService.html" data-type="entity-link" >TokenService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TriggersRepository.html" data-type="entity-link" >TriggersRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserSeeder.html" data-type="entity-link" >UserSeeder</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersRepository.html" data-type="entity-link" >UsersRepository</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AclGuard.html" data-type="entity-link" >AclGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/FakeAuthGuard.html" data-type="entity-link" >FakeAuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/IsAuthorizedGuard.html" data-type="entity-link" >IsAuthorizedGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/StimulatorActionGuard.html" data-type="entity-link" >StimulatorActionGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AclConfigFactory.html" data-type="entity-link" >AclConfigFactory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AclFindOptions.html" data-type="entity-link" >AclFindOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AclModuleAsyncConfig.html" data-type="entity-link" >AclModuleAsyncConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AclModuleConfig.html" data-type="entity-link" >AclModuleConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssetPlayerConfigFactory.html" data-type="entity-link" >AssetPlayerConfigFactory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssetPlayerModuleAsyncConfig.html" data-type="entity-link" >AssetPlayerModuleAsyncConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssetPlayerModuleConfig.html" data-type="entity-link" >AssetPlayerModuleConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuthConfigFactory.html" data-type="entity-link" >AuthConfigFactory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuthModuleAsyncConfig.html" data-type="entity-link" >AuthModuleAsyncConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuthModuleConfig.html" data-type="entity-link" >AuthModuleConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseAsyncOptions.html" data-type="entity-link" >BaseAsyncOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseBlockingCommand.html" data-type="entity-link" >BaseBlockingCommand</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseBlockingEvent.html" data-type="entity-link" >BaseBlockingEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseModuleOptions.html" data-type="entity-link" >BaseModuleOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseModuleOptionsFactory.html" data-type="entity-link" >BaseModuleOptionsFactory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CacheInfo.html" data-type="entity-link" >CacheInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CommandMap.html" data-type="entity-link" >CommandMap</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CommonConfigFactory.html" data-type="entity-link" >CommonConfigFactory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CommonModuleAsyncConfig.html" data-type="entity-link" >CommonModuleAsyncConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CommonModuleConfig.html" data-type="entity-link" >CommonModuleConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ConfigKey.html" data-type="entity-link" >ConfigKey</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ConfigKeyOptions.html" data-type="entity-link" >ConfigKeyOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ConsoleTransportOptions.html" data-type="entity-link" >ConsoleTransportOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CookieFlags.html" data-type="entity-link" >CookieFlags</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CustomExperimentRepository.html" data-type="entity-link" >CustomExperimentRepository</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CustomTransportOptions.html" data-type="entity-link" >CustomTransportOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DatabaseConfigFactory.html" data-type="entity-link" >DatabaseConfigFactory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DatabaseModuleAsyncConfig.html" data-type="entity-link" >DatabaseModuleAsyncConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DatabaseModuleConfig.html" data-type="entity-link" >DatabaseModuleConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataContainer.html" data-type="entity-link" >DataContainer</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EntityStatistic.html" data-type="entity-link" >EntityStatistic</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EntityTransformerInformation.html" data-type="entity-link" >EntityTransformerInformation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EntityTransformerService.html" data-type="entity-link" >EntityTransformerService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExperimentFindOptions.html" data-type="entity-link" >ExperimentFindOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExperimentOptionalFindOptions.html" data-type="entity-link" >ExperimentOptionalFindOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExperimentResultFindOptions.html" data-type="entity-link" >ExperimentResultFindOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExperimentResultOptionalFindOptions.html" data-type="entity-link" >ExperimentResultOptionalFindOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExperimentStopCondition.html" data-type="entity-link" >ExperimentStopCondition</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExtractedCookie.html" data-type="entity-link" >ExtractedCookie</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FailedEntityStatistics.html" data-type="entity-link" >FailedEntityStatistics</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FailedReason.html" data-type="entity-link" >FailedReason</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FakeSerialDataEmitter.html" data-type="entity-link" >FakeSerialDataEmitter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FakeSerialDataHandler.html" data-type="entity-link" >FakeSerialDataHandler</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FileBrowserConfigFactory.html" data-type="entity-link" >FileBrowserConfigFactory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FileBrowserModuleAsyncConfig.html" data-type="entity-link" >FileBrowserModuleAsyncConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FileBrowserModuleConfig.html" data-type="entity-link" >FileBrowserModuleConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FileBrowserModuleConfig-1.html" data-type="entity-link" >FileBrowserModuleConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FindOptions.html" data-type="entity-link" >FindOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IpcMessage.html" data-type="entity-link" >IpcMessage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IpcModuleConfig.html" data-type="entity-link" >IpcModuleConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/JwtAuthModuleConfig.html" data-type="entity-link" >JwtAuthModuleConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/JwtPayload.html" data-type="entity-link" >JwtPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LogConfigFactory.html" data-type="entity-link" >LogConfigFactory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginOptions.html" data-type="entity-link" >LoginOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginResponse.html" data-type="entity-link" >LoginResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LogModuleAsyncConfig.html" data-type="entity-link" >LogModuleAsyncConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LogModuleConfig.html" data-type="entity-link" >LogModuleConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PlayerLocalConfiguration.html" data-type="entity-link" >PlayerLocalConfiguration</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QueryError.html" data-type="entity-link" >QueryError</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RequestWithUser.html" data-type="entity-link" >RequestWithUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SeederInformation.html" data-type="entity-link" >SeederInformation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SeederService.html" data-type="entity-link" >SeederService</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SequenceFindOptions.html" data-type="entity-link" >SequenceFindOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SequenceGenerator.html" data-type="entity-link" >SequenceGenerator</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SequenceOptionalFindOptions.html" data-type="entity-link" >SequenceOptionalFindOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SerializedExperiment.html" data-type="entity-link" >SerializedExperiment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SerializedSequence.html" data-type="entity-link" >SerializedSequence</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SerialPort.html" data-type="entity-link" >SerialPort</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SettingsConfigFactory.html" data-type="entity-link" >SettingsConfigFactory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SettingsModuleAsyncConfig.html" data-type="entity-link" >SettingsModuleAsyncConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SettingsModuleConfig.html" data-type="entity-link" >SettingsModuleConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SetupConfiguration.html" data-type="entity-link" >SetupConfiguration</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StimulatorBlockingCommand.html" data-type="entity-link" >StimulatorBlockingCommand</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StimulatorConfigFactory.html" data-type="entity-link" >StimulatorConfigFactory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StimulatorModuleAsyncConfig.html" data-type="entity-link" >StimulatorModuleAsyncConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StimulatorModuleConfig.html" data-type="entity-link" >StimulatorModuleConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StimulatorModuleConfig-1.html" data-type="entity-link" >StimulatorModuleConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SuccessfulEntityStatistics.html" data-type="entity-link" >SuccessfulEntityStatistics</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TokenContent.html" data-type="entity-link" >TokenContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UploadedFileStructure.html" data-type="entity-link" >UploadedFileStructure</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserFindOptions.html" data-type="entity-link" >UserFindOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserOptionalFindOptions.html" data-type="entity-link" >UserOptionalFindOptions</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});